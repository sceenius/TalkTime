<template>
  <div class="page-container md-layout-column">
    <!--
      ----------------------------------------------------------------------
        SNACKBARS  - https://vuematerial.io/components/snackbar
      ----------------------------------------------------------------------
    -->
    <md-snackbar
      :md-duration="1500"
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
      id="login-dialog"
    >
      <md-dialog-title
        ><md-icon>timelapse</md-icon> Welcome to<br />&nbsp;&nbsp; &nbsp; &nbsp;
        Ta<span style="position: relative; top: -5px">l</span>k
        Time!</md-dialog-title
      >
      <div>
        This app is best used on a mobile phone. To get started, please enter
        your username.<br /><br />
        <md-field id="username">
          <label style=" color: white;">Name</label>
          <md-input
            ref="focusable"
            v-model="username"
            @keyup.prevent.esc="onConfirm();"
            @keyup.enter="onConfirm();"
            required
          ></md-input>
          <span class="md-helper-text"></span>
          <span class="md-error">Please enter a username.</span>
        </md-field>
        <center>
          <md-dialog-actions>
            <md-button
              class="md-success md-raised"
              @click="onConfirm();"
              style="background: #00B0A0; color: white;"
              ><md-icon style="color: white;">exit_to_app</md-icon>
              Enter</md-button
            >
          </md-dialog-actions>
        </center>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        TOOLBAR - https://vuematerial.io/components/toolbar/
      ----------------------------------------------------------------------
    -->
    <md-toolbar :class="['md-primary', meeting.status]">
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
            style="height: 325px !important; min-height: 325px !important;"
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
              <span>Check-out</span>
            </md-menu-item>

            <md-menu-item @click="ping_pong();">
              <md-icon>update</md-icon>
              <span>Ping Pong</span>
            </md-menu-item>

            <md-menu-item @click="random_round();">
              <md-icon>update</md-icon>
              <span>Random Round</span>
            </md-menu-item>

            <md-menu-item @click="clear();">
              <md-icon>check_box_outline_blank</md-icon>
              <span>Clear Out</span>
            </md-menu-item>

            <md-menu-item @click="onLogout();">
              <md-icon>exit_to_app</md-icon>
              <span>Logout</span>
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
              <md-menu-item @click="remove(person);">
                <md-icon>delete</md-icon>
                <span>Remove</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </li>
      </ul>
    </md-content>

    <div class="bottom-bar">
      <md-button
        v-bind:class="['bar-button', meeting.status]"
        v-long-press="interject"
        @mousedown="raise_hand"
        :disabled="
          status === 'not started' ||
            status === 'ended' ||
            status === 'ping pong' ||
            status === 'check in' ||
            status === 'check out' ||
            status === 'random'
        "
        ><md-icon>pan_tool</md-icon>
        <md-icon class="longpress">warning</md-icon>
        <div>RAISE HAND</div></md-button
      >
      <md-button
        @mousedown="topic_selector"
        :disabled="
          status === 'not started' ||
            status === 'ended' ||
            status === 'check in' ||
            status === 'check out' ||
            status === 'random'
        "
        v-bind:class="['bar-button', meeting.status]"
        ><md-icon>group_work </md-icon>
        <div>TOPICS</div></md-button
      >
      <md-button
        @mousedown="on_topic"
        :disabled="
          status === 'not started' ||
            status === 'ended' ||
            status === 'ping pong' ||
            status === 'check in' ||
            status === 'check out'
        "
        v-bind:class="['bar-button', meeting.status]"
        ><md-icon>mood</md-icon>
        <div>ON TOPIC</div></md-button
      >
      <md-button
        v-long-press="onLongPress"
        @mousedown="off_topic"
        :disabled="
          status === 'not started' ||
            status === 'ended' ||
            status === 'ping pong' ||
            status === 'check in' ||
            status === 'check out'
        "
        v-bind:class="['bar-button', meeting.status]"
      >
        <md-icon>mood_bad</md-icon>
        <md-icon class="longpress">warning</md-icon>
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
    topic: "",
    time: 0,
    timer: null,
    failed: false,
    username: "",
    domain: "diglife",
    mood: 0,
    battery: 1,
    meeting: { duration: 600, status: "green" },
    attendeesRef: "",
    parametersRef: "",
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
    ///////////////////////////////////////////////////////////////////
    // GET PARAM FROM ROUTER
    ///////////////////////////////////////////////////////////////////
    this.domain = this.$route.params.domain || "gcc";

    ///////////////////////////////////////////////////////////////////
    // SET FIREBASE REFS
    ///////////////////////////////////////////////////////////////////
    this.attendeesRef = db
      .database()
      .ref("meetings/" + this.domain + "/attendees");
    this.parametersRef = db
      .database()
      .ref("meetings/" + this.domain + "/parameters");

    ///////////////////////////////////////////////////////////////////
    // LISTEN TO PARAMETER CHANGES
    ///////////////////////////////////////////////////////////////////
    this.parametersRef.on("child_added", meeting => {
      let data = meeting.val();
      let key = meeting.key;
      if (key === "status") {
        this.status = data;
      }
    });

    this.parametersRef.on("child_changed", meeting => {
      let data = meeting.val();
      let key = meeting.key;
      if (key === "status") {
        this.status = data;
      }
    });

    ///////////////////////////////////////////////////////////////////
    // LISTEN TO ATTENDEE ADDITIONS
    ///////////////////////////////////////////////////////////////////
    this.attendeesRef.on("child_added", user => {
      let data = user.val();
      //let key = user.key;

      ///////////////////////////////////////////////////////////////////
      // PERSON IS TALKING
      ///////////////////////////////////////////////////////////////////
      // CASE -= Move talker to the top
      if (data.status.substring(2) === "talking") {
        // move standing_by away
        if (this.attendees[0].status.substring(2) === "standing_by") {
          this.attendees[0].status = "6 invisible";
        }

        // move current talker away
        else if (this.attendees[0].status.substring(2) === "talking") {
          this.attendees[0].status = "7 completing";
          this.attendeesRef
            .child(this.attendees[0].name)
            .update(this.attendees[0]);
        }
      }

      if (
        this.attendees[1] &&
        this.attendees[0].status.substring(2) === "standing_by"
      ) {
        if (
          this.attendees[1].status.substring(2) === "waiting" ||
          this.attendees[1].status.substring(2) === "interjecting"
        ) {
          this.attendees[0].name = "click to continue...";
        } else {
          this.attendees[0].name = "waiting for input...";
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

      // this is a brilliant sort function working on 2 keys
      // if the status is the same, it sorts by joined_at
      // https://stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
      if (this.status === "random") {
        this.attendees.sort(function(a, b) {
          return (
            parseInt(a.status.charAt(0), 10) -
              parseInt(b.status.charAt(0), 10) || a.random_at - b.random_at
          );
        });
      } else {
        this.attendees.sort(function(a, b) {
          return (
            parseInt(a.status.charAt(0), 10) -
              parseInt(b.status.charAt(0), 10) || a.joined_at - b.joined_at
          );
        });
      }
    });

    ///////////////////////////////////////////////////////////////////
    // FIREBASE CHILD REMOVED EVENTS
    ///////////////////////////////////////////////////////////////////
    this.attendeesRef.on("child_removed", user => {
      let data = user.val();
      console.log(">>>>>>>>>>>>>>>", data);
      // find person and change status
      this.attendees.forEach((person, index, arr) => {
        //console.log(person);
        if (person.name === data.name) {
          arr.splice(index, 1);
        }
      });
    });

    ///////////////////////////////////////////////////////////////////
    // LISTEN TO ATTENDEE CHANGES
    ///////////////////////////////////////////////////////////////////
    this.attendeesRef.on("child_changed", user => {
      let data = user.val();

      ///////////////////////////////////////////////////////////////////
      // PERSON IS MOODING
      ///////////////////////////////////////////////////////////////////
      // CASE mood button was pressed
      if (data.mood === "mood" || data.mood === "mood_bad") {
        // do nothing
      }

      ///////////////////////////////////////////////////////////////////
      // STATUS CHANGE CASE - PERSON IS TALKING
      ///////////////////////////////////////////////////////////////////
      else if (data.status.substring(2) === "talking") {
        // move standing_by away
        if (this.attendees[0].status.substring(2) === "standing_by") {
          this.attendees[0].status = "6 invisible";
        }
        // revert current talker - was not fast enough
        else if (
          this.attendees[0].status.substring(2) === "talking" &&
          this.status === "ping pong"
        ) {
          this.attendees.forEach(person => {
            if (person.name === data.name) {
              person.status = "5 racing";
              this.attendeesRef
                .child(person.name)
                .update({ status: "5 racing" });
            }
          });
        }

        // move current talker away
        else if (
          this.attendees[0].status.substring(2) === "talking" &&
          this.status !== "ping pong"
        ) {
          this.attendees[0].status = "7 completing";
          this.attendeesRef
            .child(this.attendees[0].name)
            .update(this.attendees[0]);
        }

        // if (this.status !== "check out") {
        // find person and change status
        this.attendees.forEach(person => {
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
      // PERSON IS LISTENING
      ///////////////////////////////////////////////////////////////////
      else if (
        data.status.substring(2) === "listening" &&
        this.status !== "clear out"
      ) {
        // find person and change status
        this.attendees.forEach(person => {
          if (person.name === data.name) {
            person.status = data.status;
            person.joined_at = data.joined_at;
          }

          if (person.status.substring(2) === "invisible") {
            person.status = "0 standing_by";
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // CLEAR
      ///////////////////////////////////////////////////////////////////
      else if (
        data.status.substring(2) === "listening" &&
        this.status === "clear out"
      ) {
        // find person and change status
        this.attendees.forEach(person => {
          if (person.status.substring(2) === "invisible") {
            person.status = "0 standing_by";
          } else if (person.status.substring(2) !== "standing_by") {
            person.status = data.status;
            person.joined_at = data.joined_at;
          }
        });
        this.status = "on air";
      }

      ///////////////////////////////////////////////////////////////////
      // PING PONG
      ///////////////////////////////////////////////////////////////////
      else if (
        data.status.substring(2) === "racing" &&
        this.status === "ping pong"
      ) {
        // find person and change status
        this.attendees.forEach(person => {
          if (person.status.substring(2) === "invisible") {
            person.status = "0 standing_by";
          } else if (
            person.status.substring(2) !== "standing_by" &&
            person.status.substring(2) !== "talking"
          ) {
            person.status = data.status;
            person.joined_at = data.joined_at;
            person.talk_time = data.talk_time;
          }
        });
        this.status = "ping pong";
      }

      ///////////////////////////////////////////////////////////////////
      // PERSON IS WAITING
      ///////////////////////////////////////////////////////////////////
      else if (data.status.substring(2) === "waiting") {
        if (this.attendees[0].status.substring(2) === "standing_by") {
          this.attendees[0].name = "click to continue...";
        }

        // find person and change status
        this.attendees.forEach(person => {
          //console.log(person);
          if (person.name === data.name) {
            person.status = data.status;
            person.joined_at = data.joined_at;
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // PERSON IS COMPLETING
      ///////////////////////////////////////////////////////////////////
      else if (data.status.substring(2) === "completing") {
        // find person and change status
        this.attendees.forEach(person => {
          //console.log(person);
          if (person.name === data.name) {
            // move current talker away
            person.status = "7 completing";
            person.talk_time = data.talk_time;
          }
        });

        this.time = 0; // don't stop the timer, useful for a quiet minute
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          if (person.status.substring(2) === "invisible") {
            arr[index].status = "0 standing_by";
            if (
              this.attendees[2].status.substring(2) === "waiting" ||
              this.attendees[2].status.substring(2) === "interjecting"
            ) {
              arr[index].name = "click to continue...";
            } else {
              arr[index].name = "waiting for input...";
            }
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // PERSON IS DELETING/CHECKING OUT
      ///////////////////////////////////////////////////////////////////
      else if (data.status.substring(2) === "deleting") {
        // find person and change status
        this.time = 0; // don't stop the timer, useful for a quiet minute
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          if (person.status.substring(2) === "invisible") {
            arr[index].status = "0 standing_by";
            if (
              this.attendees[2] &&
              (this.attendees[2].status.substring(2) === "waiting" ||
                this.attendees[2].status.substring(2) === "interjecting")
            ) {
              arr[index].name = "click to continue...";
            } else {
              arr[index].name = "waiting for input...";
            }
          }
        });

        this.attendees.forEach(person => {
          //console.log(person);
          if (person.name === data.name) {
            this.attendeesRef.child(person.name).remove();
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // PERSON IS INTERJECTING
      ///////////////////////////////////////////////////////////////////
      else if (data.status.substring(2) === "interjecting") {
        if (this.attendees[0].status.substring(2) === "standing_by") {
          this.attendees[0].name = "click to continue...";
        }

        // find person and change status
        this.attendees.forEach(person => {
          if (person.name === data.name) {
            person.status = data.status;
            person.joined_at = data.joined_at;
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // PERSON IS ON TOPIC
      // THIS HAS A SIDE EFFECT.... don't change other states
      ///////////////////////////////////////////////////////////////////
      this.mood = 0;
      if (data.mood === "mood") {
        this.attendees.forEach(person => {
          if (person.name === data.name) {
            person.mood = "mood";
            clearInterval(person.mood_timer);
            person.mood_timer = setInterval(() => {
              this.attendeesRef.child(person.name).update({ mood: "" });
              person.mood = "";
              this.mood--;
              clearInterval(person.mood_timer);
            }, 10000);
          }
        });
      }
      ///////////////////////////////////////////////////////////////////
      // PERSON IS OFF TOPIC
      ///////////////////////////////////////////////////////////////////
      else if (data.mood === "mood_bad") {
        this.attendees.forEach(person => {
          if (person.name === data.name) {
            person.mood = "mood_bad";
            clearInterval(person.mood_timer);
            person.mood_timer = setInterval(() => {
              this.attendeesRef.child(person.name).update({ mood: "" });
              person.mood = "";
              this.mood++;
              clearInterval(person.mood_timer);
            }, 10000);
          }
        });
      }

      ///////////////////////////////////////////////////////////////////
      // PERSON IS IN PANIC
      ///////////////////////////////////////////////////////////////////
      else if (data.mood === "mood_panic") {
        this.attendees.forEach(person => {
          if (person.name === data.name) {
            person.mood = "mood_panic";
          }
        });
      }
      ///////////////////////////////////////////////////////////////////
      //UPDATE OVERALL MOOD
      ///////////////////////////////////////////////////////////////////
      this.attendees.forEach(person => {
        if (person.mood === "mood_bad") {
          this.mood--;
        } else if (person.mood === "mood_panic") {
          this.mood = -99;
        } else {
          this.mood++;
        }
      });

      ///////////////////////////////////////////////////////////////////
      // SORT THE ARRAY
      ///////////////////////////////////////////////////////////////////

      // this is a brilliant sort function working on 2 keys
      // if the status is the same, it sorts by joined_at
      // https://stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
      if (this.status === "random") {
        this.attendees.sort(function(a, b) {
          return (
            parseInt(a.status.charAt(0), 10) -
              parseInt(b.status.charAt(0), 10) || a.random_at - b.random_at
          );
        });
      } else {
        this.attendees.sort(function(a, b) {
          return (
            parseInt(a.status.charAt(0), 10) -
              parseInt(b.status.charAt(0), 10) || a.joined_at - b.joined_at
          );
        });
      }
    });

    // function SortByName(x, y) {
    //   return x.status === y.status ? 0 : x.status > y.status ? 1 : -1;
    // }
  },

  ///////////////////////////////////////////////////////////////////
  // VUE MOUNTED
  ///////////////////////////////////////////////////////////////////
  mounted: function() {
    if (this.$cookies.get("username")) {
      this.username = this.$cookies.get("username");
      // enter different meeting and add your profile
      this.profile = this.attendees.find(user => {
        return user.name === this.username;
      });
      if (this.profile === undefined) {
        // set new profile
        this.attendeesRef.child(this.username).update({
          name: this.username,
          status: "4 listening",
          talk_time: 0,
          joined_at: new Date().getTime()
        });
      }
    } else {
      this.activeUser = true;
      // trick to get focus on field
      setTimeout(() => {
        this.$refs.focusable.$el.focus();
      }, 500);
    }
  },

  ///////////////////////////////////////////////////////////////////
  // VUE COMPUTED
  ///////////////////////////////////////////////////////////////////
  computed: {
    // TODO: RED COLOR FOR LOWEST, YELLOW FOR 1 STEP BEFORE

    ///////////////////////////////////////////////////////////////////
    // UPDATE SIGNAL - ALWAYS INCLUDE VARS THAT CHANGE DYNAMICALLY!!
    ///////////////////////////////////////////////////////////////////
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

    ///////////////////////////////////////////////////////////////////
    // UPDATE BATTERY
    ///////////////////////////////////////////////////////////////////
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
    },
    ///////////////////////////////////////////////////////////////////
    // UPDATE SPEAKER BALANCE
    ///////////////////////////////////////////////////////////////////
    //https://derickbailey.com/2014/09/21/calculating-standard-deviation-with-array-map-and-array-reduce-in-javascript/
    // signal_wifi_0_bar 0-4
    wifi_bar: function() {
      let path = "https://ledger.diglife.coop/images/icons/";
      let talk_time_total = 0;
      this.attendees.forEach(person => {
        talk_time_total = talk_time_total + person.talk_time;
      });
      return path + "signal_wifi_0_bar.png";
    }

    ///////////////////////////////////////////////////////////////////
    // UPDATE TRAFFIC LIGHT BAR
    ///////////////////////////////////////////////////////////////////
    //https://jsfiddle.net/Hunter377/upLe3nLk/1/
  },
  ///////////////////////////////////////////////////////////////////////////////
  //  VUE METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    // SIMPLE FORMATTING OF 00:00
    format: function(seconds) {
      return Moment(0)
        .seconds(seconds)
        .format("mm:ss");
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION PANIC
    ///////////////////////////////////////////////////////////////////
    onLongPress: function() {
      this.attendees.forEach(person => {
        if (person.name === this.username) {
          if (person.mood === "mood_panic") {
            person.mood = "";
            this.meeting.status = "green";
            this.snack = "Emergency protocol disabled.";
          } else {
            person.mood = "mood_panic";
            this.meeting.status = "red";
            this.snack = "Emergency protocol enabled.";
          }
        }
      });

      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION LOGIN
    ///////////////////////////////////////////////////////////////////
    onConfirm: function() {
      if (!this.username) {
        this.activeUser = true;
        document.getElementById("username").classList.add("md-invalid");
      } else {
        document.getElementById("username").classList.remove("md-invalid");
        this.username = this.username.replace("@", "").toLowerCase();
        // cookies are not stored on mobile devices, new prommpt for every session
        this.$cookies.set("username", this.username);

        // load personal profile from users (can be from refresh)
        this.profile = this.attendees.find(user => {
          return user.name === this.username;
        });
        if (this.profile === undefined) {
          // set new profile
          this.attendeesRef.child(this.username).update({
            name: this.username,
            status: "4 listening",
            talk_time: 0,
            joined_at: new Date().getTime()
          });
        }

        this.$nextTick(function() {
          this.activeUser = false;
        });
      }
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION LOGOUT
    ///////////////////////////////////////////////////////////////////
    onLogout: function() {
      // Logout
      this.profile = "";
      this.username = "";
      this.$cookies.set("username", "");
      this.activeUser = true;
      // trick to get focus on field
      setTimeout(() => {
        this.$refs.focusable.$el.focus();
      }, 500);
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION LONG PRESS
    ///////////////////////////////////////////////////////////////////
    // not used due to Vue acting up on longpress events

    ///////////////////////////////////////////////////////////////////
    // FUNCTION "I AM COMPLETE"
    ///////////////////////////////////////////////////////////////////
    complete: function(person) {
      if (person.status.substring(2) === "standing_by") {
        person.status = "6 invisible";
      } else if (this.attendees[1].status.substring(2) === "racing") {
        this.attendeesRef.child(person.name).update({
          status: "5 racing",
          talk_time: person.talk_time + this.time
        });
      } else if (this.status === "check out") {
        // remove participant
        this.attendeesRef.child(person.name).update({
          status: "8 deleting"
        });
      } else {
        // complete participant
        this.attendeesRef.child(person.name).update({
          status: "7 completing",
          talk_time: person.talk_time + this.time
        });
      }

      // CASE: next person is waiting to be called
      if (
        this.attendees[1].status.substring(2) === "waiting" ||
        this.attendees[1].status.substring(2) === "interjecting"
      ) {
        this.attendees[0].status = "6 invisible";
        this.attendeesRef
          .child(this.attendees[1].name)
          .update({ status: "1 talking" });

        // CASE: nobody is waiting to be called, put standing_by back
      } else {
        this.time = 0; // don't stop the timer, useful for a quiet minute
        this.attendees.forEach((person, index, arr) => {
          //console.log(person);
          if (person.status.substring(2) === "invisible") {
            arr[index].status = "0 standing_by";
            if (
              this.attendees[2] &&
              (this.attendees[2].status.substring(2) === "waiting" ||
                this.attendees[2].status.substring(2) === "interjecting")
            ) {
              arr[index].name = "click to continue...";
            } else {
              arr[index].name = "waiting for input...";
            }
            arr.sort(function(a, b) {
              return (
                parseInt(a.status.charAt(0), 10) -
                  parseInt(b.status.charAt(0), 10) || a.joined_at - b.joined_at
              );
            });
          }
        });
      }
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION CHECK IN
    ///////////////////////////////////////////////////////////////////
    check_in: function(meeting) {
      this.parametersRef.update({ status: "check in" });
      this.attendees.forEach(person => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          this.attendeesRef
            .child(person.name)
            .update({ status: "3 waiting", joined_at: new Date().getTime() });
        }
      });

      this.snack = "Ready for checking in.";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION CHECK OUT
    ///////////////////////////////////////////////////////////////////
    check_out: function(meeting) {
      this.parametersRef.update({ status: "check out" });
      this.attendees.forEach(person => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          this.attendeesRef
            .child(person.name)
            .update({ status: "4 listening" });
          this.attendeesRef
            .child(person.name)
            .update({ status: "3 waiting", joined_at: new Date().getTime() });
        }
      });

      this.snack = "Ready for checking in.";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION RANDOM ROUND
    ///////////////////////////////////////////////////////////////////
    random_round: function(meeting) {
      this.status = "random";
      this.attendees.forEach(person => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          this.attendeesRef.child(person.name).update({
            status: "3 waiting",
            joined_at: new Date().getTime(),
            random_at: Math.floor(
              Math.random() * Math.floor(this.attendees.length)
            )
          });
        }
      });

      this.snack = "Ready for random round.";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION PING PONG
    ///////////////////////////////////////////////////////////////////
    ping_pong: function(meeting) {
      this.parametersRef.update({ status: "ping pong" });
      this.attendees.forEach(person => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          this.attendeesRef
            .child(person.name)
            .update({ status: "5 racing", joined_at: new Date().getTime() });
        }
      });

      this.snack = "Ready for ping pong.";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION CLEAR (KEEP TIME)
    ///////////////////////////////////////////////////////////////////
    clear: function(meeting) {
      this.parametersRef.update({ status: "clear out" });
      this.attendees.forEach(person => {
        //console.log(person);
        if (person.status.substring(2) !== "standing_by") {
          this.attendeesRef
            .child(person.name)
            .update({ status: "4 listening", joined_at: new Date().getTime() });
        }
      });

      this.snack = "All attendees cleared.";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION START MEETING
    ///////////////////////////////////////////////////////////////////
    start_meeting: function(meeting) {
      this.parametersRef.update({ status: "on air" });
      this.snack = "This meeting has started";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION END MEETING
    ///////////////////////////////////////////////////////////////////
    end_meeting: function(meeting) {
      this.parametersRef.update({ status: "ended" });
      this.snack = "This meeting has ended";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION TOPIC SELECTOR
    ///////////////////////////////////////////////////////////////////
    topic_selector: function() {
      this.snack = "Coming soon to a meeting near you.";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION RAISE HAND
    ///////////////////////////////////////////////////////////////////
    raise_hand: function() {
      if (this.attendees[0].name !== this.username) {
        this.attendees.forEach(person => {
          //console.log(person);
          if (person.name === this.username) {
            this.attendeesRef
              .child(person.name)
              .update({ status: "3 waiting", joined_at: new Date().getTime() });
          }
        });

        this.snack = "You have raised your hand.";
        this.showSnackBar = true;
      }
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION INTERJECT - NORMAL AND PING PONG
    ///////////////////////////////////////////////////////////////////
    interject: function($event) {
      $event.preventDefault();
      if (this.attendees[0].name !== this.username) {
        this.attendees.forEach(person => {
          //console.log(person);
          // non-racing case
          if (
            person.name === this.username &&
            person.status.substring(2) !== "racing"
          ) {
            this.attendeesRef.child(person.name).update({
              status: "2 interjecting",
              joined_at: new Date().getTime()
            });
          } else if (
            person.name === this.username &&
            person.status.substring(2) === "racing"
          ) {
            this.failed = false;
            this.attendeesRef
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
                  : this.attendeesRef.child(person.name).update({
                      status: "1 talking",
                      joined_at: new Date().getTime()
                    })
              );
          }
        });

        //console.log(this.attendees);
        this.snack = "You are interjecting.";
        this.showSnackBar = true;
      }
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION APPOINT
    ///////////////////////////////////////////////////////////////////
    appoint: function(person) {
      this.attendeesRef.child(person.name).update({ status: "1 talking" });
      this.snack = "You have appointed " + person.name + ".";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION LOWER HAND
    ///////////////////////////////////////////////////////////////////
    withdraw: function(person) {
      this.attendeesRef.child(person.name).update({ status: "4 listening" });
      this.snack = "You have withdrawn " + person.name + ".";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION REMOVE
    ///////////////////////////////////////////////////////////////////
    remove: function(person) {
      this.attendeesRef.child(person.name).update({ status: "8 deleting" });
      this.snack = "You have removed " + person.name + ".";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION AGREE WITH TOPIC
    ///////////////////////////////////////////////////////////////////
    on_topic: function() {
      this.attendees.forEach(person => {
        //if found, set mood and clear after 1 min
        if (person.name === this.username) {
          this.attendeesRef.child(person.name).update({ mood: "mood" });
        }
      });
      this.snack = "Your mood has been registered.";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION DISAGREE WITH TOPIC
    ///////////////////////////////////////////////////////////////////
    off_topic: function() {
      this.attendees.forEach(person => {
        //if found, set mood and clear after 1 min
        if (person.name === this.username) {
          this.attendeesRef.child(person.name).update({ mood: "mood_bad" });
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
  height: 30px;
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
  height: 90px;
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

.bar-button .md-icon.longpress {
  position: absolute;
  margin: 0;
  padding: 0;
  right: 0px;
  bottom: 5px;
  font-size: 1.6em !important;
  opacity: 0.4;
}

.bar-button:disabled {
  background-color: #eee !important;
  border: 1px solid white;
  cursor: not-allowed;
}

#login-dialog {
  min-height: 510px !important;
  max-height: 510px !important;
  min-width: 350px;
  max-width: 350px !important;
  width: 350 !important;

  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)),
    url("https://ledger.diglife.coop/images/talktime/talkTimeSplash.jpg");
  background-size: cover;
  background-position: center bottom;
  background-repeat: no-repeat;
}

#login-dialog .md-dialog-actions {
  padding: 130px 0px 0px 0px;
}

#login-dialog .md-dialog-title {
  color: white;
  font-size: 2.4em !important;
  font-weight: normal;
  line-height: 0.9em !important;
}

#login-dialog .md-dialog-title .md-icon {
  margin: -10px 40px 0 -20px !important;
  color: white;
  font-size: 3em !important;
  font-weight: normal;
}

#login-dialog div {
  max-width: 350px;
  line-height: 1.2em !important;
  padding: 0 25px;
  color: white;
  font-size: 1.1em;
}

#login-dialog .md-input,
#login-dialog .md-field input,
#login-dialog .md-field ::placeholder {
  max-width: 500px;
  width: 400px;
  color: #fff !important;
  font-size: 1.3em;
  padding: 30px;
  -webkit-text-fill-color: rgba(255, 255, 255, 1);
}

#status-bar .red {
  width: 100%;
  height: 8px;
}

.red,
.bar-button.red {
  animation: glow 1000ms ease-out infinite alternate;
}
.yellow,
.bar-button.yellow {
  border-top: 8px solid #e5c62e;
}
.green,
.bar-button.green {
  border-top: 8px solid #41b883;
}

@keyframes glow {
  0% {
    border-top: 8px solid red;
  }
  100% {
    border-top: 8px solid #404040;
  }
}

.md-snackbar {
  bottom: 100px !important;
}
</style>
