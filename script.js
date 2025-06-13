const app = Vue.createApp({
  data() {
    return {
      nbbubble: 30,
      nbfish: 16,
      yellow: 0,
      blue: 0,
      pink: 0,
      green: 0,
      dead: 0,
      time: Date.now()
    };
  },
  methods: {
    fishready(num) {
      switch (this.$refs.fish[num - 1].color) {
        case "yellow":
          this.yellow++;
          break;
        case "blue":
          this.blue++;
          break;
        case "pink":
          this.pink++;
          break;
        case "green":
          this.green++;
          break;
      }
    },
    fishdied(num) {
      switch (this.$refs.fish[num - 1].color) {
        case "yellow":
          this.yellow--;
          break;
        case "blue":
          this.blue--;
          break;
        case "pink":
          this.pink--;
          break;
        case "green":
          this.green--;
          break;
      }
      if (++this.dead == this.nbfish) this.gameover();
    },
    gameover() {
      this.time = (Date.now() - this.time) / 1000;
      document.querySelector(".gameover").classList.add("show");
    },
    retry() {
      history.go(0);
    }
  }
});

app.component("bubble", {
  data() {
    let animduration = 3 + 0.5 * (Math.floor(Math.random() * 20) + 1);
    let delay = (Math.random() * animduration).toFixed(2);
    return { duration: animduration, delay: delay };
  },
  template: `
        <div class="bubble-rise" :style="'animation-delay: -' + delay + 's; animation-duration: ' + duration + 's;'">
            <div class="bubble"></div>
        </div>`
});

app.component("fish", {
  props: ["num"],
  data() {
    let colors = ["yellow", "blue", "pink", "green"];
    let color = colors[Math.floor(Math.random() * 4)];
    return {
      state: "alive",
      color: color,
      container: null,
      timerstarve: null,
      timerdie: null
    };
  },
  created() {
    this.$nextTick(() => {
      this.container = document.getElementById("fish_" + this.num);
      let top = (Math.floor(Math.random() * 50) + 35).toFixed(2);
      let duration = Math.floor(Math.random() * 30) + 20;
      let delay = (Math.random() * duration).toFixed(2);
      let bezier1 = (Math.random() * 0.8 + 0.1).toFixed(2);
      let bezier2 = (Math.random() * 1 + 1).toFixed(2);
      let bezier3 = (Math.random() * 0.8 + 0.1).toFixed(2);
      let bezier4 = (Math.random() * 0.5 + 0.25).toFixed(2);
      this.container.setAttribute(
        "style",
        "top: " +
          top +
          "vh; animation: fish " +
          duration +
          "s cubic-bezier(" +
          bezier1 +
          ", " +
          bezier2 +
          ", " +
          bezier3 +
          ", " +
          bezier4 +
          ") -" +
          delay +
          "s infinite normal;"
      );
      this.alive();
      this.$emit("ready");
    });
  },
  methods: {
    alive() {
      this.state = "alive";
      this.timerstarve = setTimeout(() => {
        this.starve();
      }, Math.floor(Math.random() * 20000) + 10000);
    },

    starve() {
      this.state = "starving";
      this.timerdie = setTimeout(() => {
        this.die();
      }, Math.floor(Math.random() * 10000) + 5000);
    },

    die() {
      this.state = "dead";
      setTimeout(() => {
        this.container.style.display = "none";
        this.$emit("died");
      }, 1000);
    },

    feed() {
      if (this.state == "starving") {
        clearTimeout(this.timerdie);
        this.alive();
      } else if (this.state == "alive") {
        clearTimeout(this.timerstarve);
        this.die();
      }
    }
  },
  template: `
        <div :id="'fish_'+num" :class="'fish '+color+' '+state" @click="feed()">
            <div class="top-fin"></div>
            <div class="fish-body"></div>
            <div class="tail-fin"></div>
            <div class="side-fin"></div>
            <div class="scale scale-1"></div>
            <div class="scale scale-2"></div>
            <div class="scale scale-3"></div>
            <div class="pizza"></div>
        </div>`
});

app.mount("body");