<template>
  <div class="page-container md-layout-column">
    <!--
      ----------------------------------------------------------------------
        SNACKBARS  - https://vuematerial.io/components/snackbar
      ----------------------------------------------------------------------
    -->
    <md-snackbar
      :md-duration="1000"
      :md-active.sync="showSnackBar"
      md-persistent
    >
      <span>{{ snack }}</span>
      <md-button class="md-primary" @click="showSnackBar = false;"
        >Dismiss
      </md-button>
    </md-snackbar>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES  - https://vuematerial.io/components/dialog
      ----------------------------------------------------------------------
    -->
    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - LOGIN DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog
      :md-close-on-esc="false"
      :md-click-outside-to-close="false"
      :md-active.sync="activeUser"
      style="max-width: 400px; max-height: 350px !important;"
    >
      <md-dialog-title
        ><md-icon>timelapse</md-icon> Welcome to Talk Time!</md-dialog-title
      >
      <div style="padding: 0 25px ;">
        This app is best used on a mobile phone. To get started, please enter
        your username.<br /><br />
        <md-field id="username">
          <label>Username</label>
          <md-input
            v-model="username"
            @keyup.prevent.esc="onConfirm();"
            @keyup.enter="onConfirm();"
            required
          ></md-input>
          <span class="md-helper-text"></span>
          <span class="md-error">Please enter a username.</span>
          <md-icon>person</md-icon>
        </md-field>
        <md-dialog-actions style="padding: 25px 0;">
          <md-button
            class="md-success md-raised"
            @click="onConfirm();"
            style="background: #00B0A0; color: white;"
            ><md-icon style="color: white;">exit_to_app</md-icon>
            Enter</md-button
          >
        </md-dialog-actions>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        TOOLBAR - https://vuematerial.io/components/toolbar/
      ----------------------------------------------------------------------
    -->
    <md-toolbar :class="['md-primary']">
      <!--
        md-button class="md-icon-button" @click="showNavigation = true;">
          <md-icon>menu</md-icon>
        </md-button
      -->
      <!-- Show the title and navigation path here -->
      <!-- img src="https://diglife.com/brand/logo_primary.svg" / -->
      <span class="md-title"> <md-icon>timelapse</md-icon> TALK TIME</span>
      <md-chip
        v-if="
          status === 'on air' ||
            status === 'check in' ||
            status === 'check out' ||
            status === 'random' ||
            status === 'ping pong'
        "
        style="background-color: #e64d3d !important;"
        >{{ status }}</md-chip
      >
      <md-chip
        v-else
        style="background-color: rgba(255, 255, 255, 0.5) !important;"
        >{{ status }}</md-chip
      >
      <div style="position: absolute; right: 0px">
        <img style="" width="30" v-bind:src="battery_bar" />
        <img style="" width="30" v-bind:src="signal_bar" />

        <md-menu style="padding: 10px; cursor: pointer;">
          <md-icon md-menu-trigger>more_vert</md-icon>

          <md-menu-content
            class="md-card-menu"
            style="min-height: 255px !important;"
          >
            <md-menu-item @click="start_meeting();">
              <md-icon>power_settings_new</md-icon>
              <span>Start Meeting</span>
            </md-menu-item>

            <md-menu-item @click="end_meeting();">
              <md-icon>power_settings_new</md-icon>
              <span>End Meeting</span>
            </md-menu-item>

            <md-menu-item @click="settings();">
              <md-icon>settings_power</md-icon>
              <span>Settings</span>
            </md-menu-item>

            <md-menu-item @click="check_in();">
              <md-icon>update</md-icon>
              <span>Check-in</span>
            </md-menu-item>

            <md-menu-item @click="check_out();">
              <md-icon>update</md-icon>
              <span>Reverse-out</span>
            </md-menu-item>

            <md-menu-item @click="ping_pong();">
              <md-icon>update</md-icon>
              <span>Ping Pong</span>
            </md-menu-item>

            <md-menu-item @click="clear();">
              <md-icon>check_box_outline_blank</md-icon>
              <span>Clear Out</span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </md-toolbar>

    <!--
      ----------------------------------------------------------------------
        PAGE CONTENT
      ----------------------------------------------------------------------
    -->
    <md-content class="md-scrollbar">
      <ul>
        <li
          v-if="person.status.substring(2) !== 'invisible'"
          v-for="(person, index) in attendees"
          :key="index"
          @click="index === 0 ? complete(person) : null;"
          v-bind:style="[
            {
              backgroundColor: color[person.status.substring(2)],
              cursor: cursor[person.status.substring(2)]
            }
          ]"
        >
          <span
            style="position: absolute; right: 10px; margin-top: 2px;"
            v-if="index === 0"
            >{{ format(time) }}</span
          >
          <span
            style="position: absolute; right: 40px; margin-top: 3px; font-size: 0.8em"
            v-else
            >{{ format(person.talk_time) }}</span
          >
          <md-icon>{{ icon[person.status.substring(2)] }}</md-icon>
          {{ person.name }} <md-icon>{{ person.mood }}</md-icon>
          <md-menu
            v-if="person.status.substring(2) !== 'talking' && index !== 0"
            style="padding: 10px; cursor: pointer;"
          >
            <md-icon md-menu-trigger>more_vert</md-icon>

            <md-menu-content class="md-card-menu">
              <md-menu-item @click="withdraw(person);">
                <md-icon>cancel</md-icon>
                <span>Withdraw</span>
              </md-menu-item>
              <md-menu-item @click="appoint(person);">
                <md-icon>record_voice_over</md-icon>
                <span>Appoint</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </li>
      </ul>
    </md-content>

    <div class="bottom-bar">
      <md-button
        @click="raise_hand(username);"
        :disabled="
          status === 'not started' ||
            status === 'ended' ||
            status === 'ping pong' ||
            status === 'check in' ||
            status === 'check out' ||
            status === 'random'
        "
        class="bar-button"
        ><md-icon>pan_tool</md-icon>
        <div>RAISE HAND</div></md-button
      >
      <md-button
        @click="interject(username);"
        :disabled="
          status === 'not started' ||
            status === 'ended' ||
            status === 'check in' ||
            status === 'check out' ||
            status === 'random'
        "
        class="bar-button"
        ><md-icon>warning</md-icon>
        <div>INTERJECT</div></md-button
      >
      <md-button
        @click="on_topic(username);"
        :disabled="
          status === 'not started' ||
            status === 'ended' ||
            status === 'ping pong' ||
            status === 'check in' ||
            status === 'check out'
        "
        class="bar-button"
        ><md-icon>mood</md-icon>
        <div>ON TOPIC</div></md-button
      >
      <md-button
        @click="off_topic(username);"
        :disabled="
          status === 'not started' ||
            status === 'ended' ||
            status === 'ping pong' ||
            status === 'check in' ||
            status === 'check out'
        "
        class="bar-button"
        ><md-icon>mood_bad</md-icon>
        <div>OFF TOPIC</div></md-button
      >
    </div>
  </div>
  <!-- END page-container md-layout-column -->
</template>

<script>
import Moment from "moment";
import db from "../firebase/init.js";
export default {
  name: "Meetings",
  props: { msg: String },
  data: () => ({
    // form: {
    //   username: null
    // },
    showNavigation: false,
    showSidepanel: false,
    showServices: false,
    showSnackBar: false,
    activeUser: false,
    power: false,
    snack: "",
    status: "not started",
    action: "none",
    topic: "",
    time: 0,
    timer: null,
    failed: false,
    username: "",
    mood: 0,
    battery: 1,
    meeting: { duration: 600 },
    users: [],
    attendees: [
      { name: "waiting for input...", status: "0 standing_by", talk_time: 0 }
    ],
    icon: {
      standing_by: "access_time", // #0
      talking: "record_voice_over", // #1
      interjecting: "warning", // #2
      waiting: "pan_tool", // #3
      listening: "check_box_outline_blank", // #4
      racing: "warning", // #5
      hiding: "", // #6
      completing: "check_box" // #7
    },
    color: {
      standing_by: "#e5c62e",
      talking: "#2ccd70",
      interjecting: "#e64d3d",
      waiting: "#3598db",
      listening: "#ccc",
      racing: "#e5c62e",
      hiding: "",
      completing: "#ccc"
    },
    cursor: {
      standing_by: "pointer",
      talking: "pointer",
      interjecting: "default",
      waiting: "default",
      listening: "default",
      racing: "default",
      hiding: "",
      completing: "default"
    }
    // colors: [
    //   "#AAE0FA",
    //   "#D8DF20",
    //   "#FFCA08",
    //   "#ED008C",
    //   "#01ABCE",
    //   "#71BF45",
    //   "#F7941D",
    //   "#D41E4E",
    //   "#00A65E",
    //   "#F25822",
    //   "#AC54A0",
    //   "#5C2E91"
    // ]
  }),
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {
    let attendeesRef = db.database().ref("meetings/test/attendees");
    let parametersRef = db.database().ref("meetings/test/parameters");

    parametersRef.on("child_added", meeting => {
      let data = meeting.val();
      let key = meeting.key;
      if (key === "status") {
        this.status = data;
      }
    });

    parametersRef.on("child_changed", meeting => {
      let data = meeting.val();
      let key = meeting.key;
      if (key === "status") {
        this.status = data;
      }
    });

    this.mood = 0;
    ///////////////////////////////////////////////////////////////////
    // FIREBASE CHILD ADDED EVENTS
    ///////////////////////////////////////////////////////////////////
    attendeesRef.on("child_added", user => {
      let data = user.val();
      let key = user.key;

      ///////////////////////////////////////////////////////////////////
      // CASES TO ADJUST DATA - PERSON IS TALKING
      ///////////////////////////////////////////////////////////////////
      if (data.status.substring(2) === "talking") {
        // move standing_by away
        if (this.attendees[0].status.substring(2) === "standing_by") {
          this.attendees[0].status = "6 invisible";
        }

        // move current talker away
        else if (this.attendees[0].status.substring(2) === "talking") {
          this.attendees[0].status = "7 completing";
          attendeesRef.child(this.attendees[0].name).update(this.attendees[0]);
        }
      }

      // compute mood
      if (data.mood === "mood_bad") {
        this.mood--;
      } else {
        this.mood++;
      }
      // add  data to users array
      this.attendees.push(data);
      this.attendees.sort(SortByName);
    });

    ///////////////////////////////////////////////////////////////////
    // FIREBASE CHILD CHANGED EVENTS
    ///////////////////////////////////////////////////////////////////

    attendeesRef.on("child_changed", user => {
      let data = user.val();

      ///////////////////////////////////////////////////////////////////
      // STATUS CHANGE CASE - PERSON IS TALKING
      ///////////////////////////////////////////////////////////////////
      if (data.status.substring(2) === "talking") {
        // move standing_by away
        if (this.attendees[0].status.substring(2) === "standing_by") {
          this.attendees[0].status = "6 invisible";
        }
        // move current talker away
        else if (
          this.attendees[0].status.substring(2) === "talking" &&
          this.status !== "ping pong"
        ) {
          this.attendees[0].status = "7 completing";
          attendeesRef.child(this.attendees[0].name).update(this.attendees[0]);
        }
        // revert current talker - was not fast enough
        else if (
          this.attendees[0].status.substring(2) === "talking" &&
          this.status === "ping pong"
        ) {
          this.attendees.forEach((person, index, arr) => {
            if (person.name === data.name) {
              person.status = "5 racing";
              console.log("-----", person);
              attendeesRef.child(person.name).update({ status: "5 racing" });
            }
          });
        }

        // if (this.status === "ping pong") {
        // find person and change status
        this.attendees.forEach((person, index, arr) => {
          if (person.name === data.name) {
            person.status = data.status;
            person.started = new Date().getTime();
            // push to FB, set timer in child_changed
            this.time = 0;
            clearInterval(this.timer);
            this.timer = setInterval(() => {
              this.time++;
              if (this.attendees[0].name === this.username) {
                this.battery =
                  1 -
                  (this.time + person.talk_time) /
                    ((this.meeting.duration / this.attendees.length) * 2);
              }
            }, 1000);
          }
        });
        // }
      }

      ///////////////////////////////////////////////////////////////////
      // STATUS CHANGE CASE  - PERSON IS LISTENING
      ///////////////////////////////////////////////////////////////////
      else if (
        data.status.substring(2) === "listening" &&
        this.status !== "clear out"
      ) {
        // find person and change status
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          if (person.name === data.name) {
            person.status = "4 listening";
          }

          if (person.status.substring(2) === "invisible") {
            person.status = "0 standing_by";
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // STATUS CHANGE CASE  - CLEAR
      ///////////////////////////////////////////////////////////////////
      else if (
        data.status.substring(2) === "listening" &&
        this.status === "clear out"
      ) {
        // find person and change status
        this.attendees.forEach((person, index, arr) => {
          if (person.status.substring(2) === "invisible") {
            person.status = "0 standing_by";
          } else if (person.status.substring(2) !== "standing_by") {
            person.status = "4 listening";
          }
        });
        this.status = "on air";
      }

      ///////////////////////////////////////////////////////////////////
      // STATUS CHANGE CASE  - PING PONG
      ///////////////////////////////////////////////////////////////////
      else if (
        data.status.substring(2) === "racing" &&
        this.status === "ping pong"
      ) {
        // find person and change status
        this.attendees.forEach((person, index, arr) => {
          if (person.status.substring(2) === "invisible") {
            person.status = "0 standing_by";
          } else if (
            person.status.substring(2) !== "standing_by" &&
            person.status.substring(2) !== "talking"
          ) {
            person.status = "5 racing";
            person.talk_time = data.talk_time;
          }
        });
        this.status = "ping pong";
      }

      ///////////////////////////////////////////////////////////////////
      // STATUS CHANGE CASE  - PERSON IS WAITING
      ///////////////////////////////////////////////////////////////////
      else if (data.status.substring(2) === "waiting") {
        if (this.attendees[0].status.substring(2) === "standing_by") {
          this.attendees[0].name = "click to continue...";
        }

        // find person and change status
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          if (person.name === data.name) {
            person.status = "3 waiting";
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // STATUS CHANGE CASE  - PERSON IS COMPLETING
      ///////////////////////////////////////////////////////////////////
      else if (data.status.substring(2) === "completing") {
        // find person and change status
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          if (person.name === data.name) {
            person.status = "7 completing";
            person.talk_time = data.talk_time;
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // STATUS CHANGE CASE  - PERSON IS INTERJECTING
      ///////////////////////////////////////////////////////////////////
      else if (data.status.substring(2) === "interjecting") {
        if (this.attendees[0].status.substring(2) === "standing_by") {
          this.attendees[0].name = "click to continue...";
        }

        // find person and change status
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          if (person.name === data.name) {
            person.status = "2 interjecting";
            // if (this.attendees[0].status.substring(2) === "standing_by") {
            //   this.attendees[0].status = "6 invisible";
            // }
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // MOOD CHANGE CASE  - PERSON IS ON TOPIC
      ///////////////////////////////////////////////////////////////////
      this.mood = 0;
      if (data.mood === "mood") {
        this.attendees.forEach((person, index, arr) => {
          if (person.name === data.name) {
            person.mood = "mood";
            clearInterval(person.mood_timer);
            person.mood_timer = setInterval(() => {
              attendeesRef.child(person.name).update({ mood: "" });
              person.mood = "";
              this.mood--;
              clearInterval(person.mood_timer);
            }, 10000);
          }
        });
      }
      ///////////////////////////////////////////////////////////////////
      // MOOD CHANGE CASE  - PERSON IS OFF TOPIC
      ///////////////////////////////////////////////////////////////////
      else if (data.mood === "mood_bad") {
        this.attendees.forEach((person, index, arr) => {
          if (person.name === data.name) {
            person.mood = "mood_bad";
            clearInterval(person.mood_timer);
            person.mood_timer = setInterval(() => {
              attendeesRef.child(person.name).update({ mood: "" });
              person.mood = "";
              this.mood++;
              clearInterval(person.mood_timer);
            }, 10000);
          }
        });
      }
      ///////////////////////////////////////////////////////////////////
      // MOOD CHANGE CASE  - UPDATE OVERALL MOOD
      ///////////////////////////////////////////////////////////////////
      this.attendees.forEach((person, index, arr) => {
        if (person.mood === "mood_bad") {
          this.mood--;
        } else {
          this.mood++;
        }
      });

      // always sort at the end
      if (this.status === "check out") {
        this.attendees.reverse();
      }
      this.attendees.sort(SortByName);
    });

    function SortByName(x, y) {
      return x.status === y.status ? 0 : x.status > y.status ? 1 : -1;
    }
  },

  mounted: function() {
    this.activeUser = true;
  },

  computed: {
    signal_bar: function() {
      let path = "https://ledger.diglife.coop/images/icons/";
      if (this.mood / (this.attendees.length - 1) <= 0) {
        return path + "signal_0_bar.png";
      } else if (this.mood / (this.attendees.length - 1) <= 0.3) {
        return path + "signal_1_bar.png";
      } else if (this.mood / (this.attendees.length - 1) <= 0.6) {
        return path + "signal_2_bar.png";
      } else if (this.mood / (this.attendees.length - 1) <= 0.9) {
        return path + "signal_3_bar.png";
      } else if (this.mood / (this.attendees.length - 1) > 0.9) {
        return path + "signal_4_bar.png";
      }
    },
    battery_bar: function() {
      let path = "https://ledger.diglife.coop/images/icons/";
      if (this.battery <= 0) {
        return path + "battery_0.png";
      } else if (this.battery <= 0.2) {
        return path + "battery_20.png";
      } else if (this.battery <= 0.3) {
        return path + "battery_30.png";
      } else if (this.battery <= 0.5) {
        return path + "battery_50.png";
      } else if (this.battery <= 0.6) {
        return path + "battery_60.png";
      } else if (this.battery <= 0.8) {
        return path + "battery_80.png";
      } else if (this.battery <= 0.9) {
        return path + "battery_90.png";
      } else if (this.battery > 0.9) {
        return path + "battery_100.png";
      }
    }
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    // SIMPLE FORMATTING OF 00:00
    format: function(seconds) {
      return Moment(0)
        .seconds(seconds)
        .format("mm:ss");
    },

    onConfirm: function() {
      let attendeesRef = db.database().ref("meetings/test/attendees");
      if (!this.username) {
        this.activeUser = true;
        document.getElementById("username").classList.add("md-invalid");
      } else {
        document.getElementById("username").classList.remove("md-invalid");
        this.username = this.username.replace("@", "").toLowerCase();
        // cookies are not stored on mobile devices, new prommpt for every session
        //this.$cookies.set("username", this.username);

        // load personal profile from users
        this.profile = this.attendees.find(user => {
          return user.name === this.username;
        });
        if (this.profile === undefined) {
          attendeesRef.child(this.username).update({
            name: this.username,
            status: "4 listening",
            talk_time: 1
          });
        }

        this.$nextTick(function() {
          this.activeUser = false;
        });
      }
    },

    // MOST IMPORTANT FUNCTION - "I AM COMPLETE"
    complete: function(person) {
      let attendeesRef = db.database().ref("meetings/test/attendees");

      if (person.status.substring(2) === "standing_by") {
        person.status = "6 invisible";
      } else if (this.attendees[1].status.substring(2) === "racing") {
        // person.talk_time = person.talk_time + this.time;
        // person.status = "5 racing";
        attendeesRef.child(person.name).update({ status: "5 racing" });
        attendeesRef
          .child(person.name)
          .update({ talk_time: person.talk_time + this.time });
      } else {
        // person.talk_time = person.talk_time + this.time;
        // person.status = "7 completing";
        attendeesRef.child(person.name).update({ status: "7 completing" });
        attendeesRef
          .child(person.name)
          .update({ talk_time: person.talk_time + this.time });
      }
      // this.attendees.sort(
      //   (a, b) => (a.status > b.status) - (a.status < b.status)
      // );
      //console.log(this.attendees);

      // CASE: next person is waiting to be called
      if (
        this.attendees[1].status.substring(2) === "waiting" ||
        this.attendees[1].status.substring(2) === "interjecting"
      ) {
        attendeesRef
          .child(this.attendees[1].name)
          .update({ status: "1 talking" });
        // this.attendees[0].status = "1 talking";
        // this.attendees[0].started = new Date().getTime();
        // // push to FB, set timer in child_changed
        // this.time = 0;
        // clearInterval(this.timer);
        // this.timer = setInterval(() => {
        //   this.time++;
        //   if (this.attendees[0].name === this.username) {
        //     this.battery =
        //       1 -
        //       (this.time + this.attendees[0].talk_time) /
        //         ((this.meeting.duration / this.attendees.length) * 2);
        //   }
        // }, 1000);

        // CASE: nobody is waiting to be called, put standing_by back
      } else {
        this.time = 0; // don't stop the timer, useful for a quiet minute
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          if (person.status.substring(2) === "invisible") {
            arr[index].status = "0 standing_by";
            arr[index].name = "waiting for input...";
            arr.sort((a, b) => (a.status > b.status) - (a.status < b.status));
          }
        });
      }
    },

    // ALL ATTENDEES = WAITING
    check_in: function(meeting) {
      let attendeesRef = db.database().ref("meetings/test/attendees");
      let meetingsRef = db.database().ref("meetings/test/parameters");
      meetingsRef.update({ status: "check in" });

      this.attendees.forEach((person, index, arr) => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          attendeesRef.child(person.name).update({ status: "3 waiting" });
        }
      });

      this.snack = "Ready for checking in.";
      this.showSnackBar = true;
    },

    // ALL ATTENDEES WAITING IN REVERSE ORDER
    check_out: function(meeting) {
      let attendeesRef = db.database().ref("meetings/test/attendees");
      let meetingsRef = db.database().ref("meetings/test/parameters");
      meetingsRef.update({ status: "check out" });

      this.attendees.forEach((person, index, arr) => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          attendeesRef.child(person.name).update({ status: "4 listening" });
          attendeesRef.child(person.name).update({ status: "3 waiting" });
        }
      });

      this.snack = "Ready for checking in.";
      this.showSnackBar = true;
    },

    // ALL ATTENDEES WAITING IN RANDOM ORDER
    random_round: function(meeting) {
      this.status = "random";
      this.attendees.forEach((person, index, arr) => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          person.status = "3 waiting";
        }
      });

      this.attendees.sort(function() {
        return 0.5 - Math.random();
      });
      this.attendees.sort(
        (a, b) => (a.status > b.status) - (a.status < b.status)
      );
      this.snack = "Ready for random round.";
      this.showSnackBar = true;
    },

    // ALL ATTENDEES CAN CALL ANYTIME
    ping_pong: function(meeting) {
      let attendeesRef = db.database().ref("meetings/test/attendees");
      let meetingsRef = db.database().ref("meetings/test/parameters");
      meetingsRef.update({ status: "ping pong" });

      this.attendees.forEach((person, index, arr) => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          attendeesRef.child(person.name).update({ status: "5 racing" });
        }
      });

      this.snack = "Ready for ping pong.";
      this.showSnackBar = true;
    },

    // CLEAR ALL ATTENDEE STATUS, BUT NOT TIME
    clear: function(meeting) {
      let attendeesRef = db.database().ref("meetings/test/attendees");
      let meetingsRef = db.database().ref("meetings/test/parameters");
      meetingsRef.update({ status: "clear out" });

      this.attendees.forEach((person, index, arr) => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          attendeesRef.child(person.name).update({ status: "4 listening" });
        }
      });

      this.snack = "Ready for checking in.";
      this.showSnackBar = true;
    },

    // ENABLE BUTTONS
    start_meeting: function(meeting) {
      let meetingsRef = db.database().ref("meetings/test/parameters");
      meetingsRef.update({ status: "on air" });
      this.snack = "This meeting has started";
      this.showSnackBar = true;
    },

    // DISABLE BUTTONS
    end_meeting: function(meeting) {
      let meetingsRef = db.database().ref("meetings/test/parameters");
      meetingsRef.update({ status: "ended" });
      this.snack = "This meeting has ended";
      this.showSnackBar = true;
    },

    // BIG BUTTON RAISE HAND
    raise_hand: function(name) {
      let attendeesRef = db.database().ref("meetings/test/attendees");

      if (this.attendees[0].name !== this.username) {
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          if (person.name === name) {
            attendeesRef.child(person.name).update({ status: "3 waiting" });
          }
        });

        this.snack = "You have raised your hand.";
        this.showSnackBar = true;
      }
    },

    // BIG BUTTON INTERJECT
    interject: function(name) {
      let attendeesRef = db.database().ref("meetings/test/attendees");

      if (this.attendees[0].name !== this.username) {
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          // non-racing case
          if (person.name === name && person.status.substring(2) !== "racing") {
            attendeesRef
              .child(person.name)
              .update({ status: "2 interjecting" });
          } else if (
            person.name === name &&
            person.status.substring(2) === "racing"
          ) {
            this.failed = false;
            attendeesRef
              .once("value", attendees => {
                attendees.forEach(snapshot => {
                  let data = snapshot.val();
                  if (data.status.substring(2) === "talking") {
                    this.failed = true;
                  }
                });
              })
              .then(
                this.failed
                  ? null
                  : attendeesRef
                      .child(person.name)
                      .update({ status: "1 talking" })
              );
          }
        });

        //console.log(this.attendees);
        this.snack = "You are interjecting.";
        this.showSnackBar = true;
      }
    },

    // PICK ONE ATTENDEE TO TALK, GOOD FOR MANUAL UPDATE
    appoint: function(person) {
      let attendeesRef = db.database().ref("meetings/test/attendees");
      attendeesRef.child(person.name).update({ status: "1 talking" });

      this.snack = "You have appointed " + person.name + ".";
      this.showSnackBar = true;
    },

    // LOWER HAND
    withdraw: function(person) {
      let attendeesRef = db.database().ref("meetings/test/attendees");
      attendeesRef.child(person.name).update({ status: "4 listening" });

      this.snack = "You have withdrawn " + person.name + ".";
      this.showSnackBar = true;
      this.action = "reject";
    },

    // AGREE WITH TOPIC
    on_topic: function(name) {
      let attendeesRef = db.database().ref("meetings/test/attendees");

      this.attendees.forEach((person, index, arr) => {
        //if found, set mood and clear after 1 min
        if (person.name === name) {
          attendeesRef.child(person.name).update({ mood: "mood" });
        }
      });
      this.snack = "Your mood has been registered.";
      this.showSnackBar = true;
    },

    // DISAGREE WITH TOPIC
    off_topic: function(name) {
      let attendeesRef = db.database().ref("meetings/test/attendees");

      this.attendees.forEach((person, index, arr) => {
        //if found, set mood and clear after 1 min
        if (person.name === name) {
          attendeesRef.child(person.name).update({ mood: "mood_bad" });
        }
      });
      this.snack = "Your mood has been registered.";
      this.showSnackBar = true;
    }
  }
};
</script>

<style>
.md-toolbar {
  background-color: #404040 !important;
}

span.md-title {
  margin-left: 0px !important;
  font-weight: bold !important;
}

.md-content {
  position: absolute;
  top: 60px;
  width: 100%;
  bottom: 80px !important;
  overflow: auto;
}

.md-content ul {
  margin: 0;
  padding: 0;
}

.md-content li:first-child {
  margin: 4px 0 10px;
  border: none;
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

.md-content li {
  padding: 10px;
  margin: 0px;
  font-size: 1.6em;
  width: 100%;
  display: block;
  color: white;
  border: 1px solid white;
  background-color: #2ccd70;
}

.md-content li .md-icon {
  color: white !important;
}

.md-content li .md-menu {
  position: absolute;
  right: 10px;
  color: white !important;
  padding: 0 !important;
  margin: 0 !important;
}

.md-chip {
  background-color: rgba(255, 255, 255, 0.4) !important;
  color: #fff !important;
  margin-left: 15px;
}

.md-field {
  margin: 10px;
}

.md-card-menu .md-list-item-content {
  min-height: 20px !important;
  padding: 5px;
  margin-right: -40px;
}

.md-card-menu .md-menu-item span {
  font-size: 0.9em !important;
  position: absolute;
  left: 34px;
}

.md-card-menu .md-menu-item .md-icon {
  font-size: 1.4em !important;
}

.md-card-menu {
  margin: 15px 0px 0 -80px !important;
  width: 140px !important;
}

.md-button.bar-button {
  background-color: #404040 !important;
  border: 1px solid white;
  color: white !important;
  height: 80px;
  width: 25%;
  margin: 0px;
}

.bar-button.md-button div {
  margin: 0 0 -10px 0;
}

.bar-button .md-icon {
  color: white !important;
  font-size: 3em !important;
  margin: -25px 0 10px 0;
}

.bottom-bar {
  position: absolute;
  bottom: 0px;
  width: 100%;
}

.bar-button:disabled {
  background-color: #eee !important;
  border: 1px solid white;
  cursor: not-allowed;
}
</style>
