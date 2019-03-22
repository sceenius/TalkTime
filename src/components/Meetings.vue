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
      md-position="left"
    >
      <span>{{ snack }}</span>
      <md-button class="md-primary" @click="showSnackBar = false;">Dismiss</md-button>
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
      <md-dialog-title>
        <md-icon>timelapse</md-icon>Welcome to
        <br>&nbsp;&nbsp; &nbsp; &nbsp;
        Ta
        <span style="position: relative; top: -5px">l</span>k
        Time!
      </md-dialog-title>
      <div>To get started, please enter your username.
        <br>
        <br>
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
            >
              <md-icon style="color: white;">exit_to_app</md-icon>Enter
            </md-button>
          </md-dialog-actions>
        </center>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - MEETING SETTINGS
      ----------------------------------------------------------------------
    -->
    <md-dialog
      :md-close-on-esc="true"
      :md-click-outside-to-close="true"
      :md-active.sync="activeSetting"
    >
      <md-dialog-title>
        <md-icon>settings_power</md-icon>Meeting Settings
      </md-dialog-title>
      <div style="padding: 30px;">Set your meeting parameters here.
        <md-field id="videoLink">
          <label>Video Conference Link</label>
          <md-input v-model="videoLink" required></md-input>
          <span class="md-helper-text">Enter video conference URL</span>
          <span class="md-error">Please enter a link.</span>
        </md-field>

        <md-field id="meetingDuration">
          <label>Meeting Duration</label>
          <md-input v-model="meetingDuration" required></md-input>
          <span class="md-helper-text">Enter duration in mins</span>
          <span class="md-error">Please enter a duration.</span>
        </md-field>

        <md-field id="moodDuration">
          <label>Mood Duration</label>
          <md-input v-model="moodDuration" required></md-input>
          <span class="md-helper-text">Enter duration in mins</span>
          <span class="md-error">Please enter a duration.</span>
        </md-field>

        <md-dialog-actions>
          <md-button
            class="md-success md-raised"
            @click="onConfirmSettings();"
            style="background: #00B0A0; color: white; margin: 20px -10px -10px 0;"
          >
            <md-icon style="color: white;">exit_to_app</md-icon>Save
          </md-button>
        </md-dialog-actions>
      </div>
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        DIALOG BOXES - APPLICATON SETTINGS
      ----------------------------------------------------------------------
    -->
    <md-dialog
      :md-close-on-esc="true"
      :md-click-outside-to-close="true"
      :md-active.sync="activeApplication"
    >
      <md-dialog-title>
        <md-icon>settings_power</md-icon>Meeting Settings
      </md-dialog-title>
      <div style="padding: 20px;">You can customize your Talk Time here.
        <br>
        <br>

        <md-field id="menutitle">
          <label>Title</label>
          <md-input v-model="menutitle" required></md-input>
          <span class="md-helper-text">Enter the title of this Menu Entry</span>
          <span class="md-error">This field cannot be blank</span>
        </md-field>

        <md-field>
          <label>Icon</label>
          <md-input v-model="menuicon" required></md-input>
          <span class="md-helper-text">
            Pick an icon
            <a
              href="https://material.io/tools/icons/?style=baseline"
              target="icons"
            >from this list</a>
          </span>
          <span class="md-error"></span>
          <md-icon>{{ menuicon }}</md-icon>
        </md-field>
        <md-field id="videoLink">
          <label>Video Conference Link</label>
          <md-input v-model="videoLink" required></md-input>
          <span class="md-helper-text"></span>
          <span class="md-error">Please enter a link.</span>
        </md-field>
        <md-field id="appLink">
          <label>Application Link</label>
          <md-input v-model="appLink" required></md-input>
          <span class="md-helper-text"></span>
          <span class="md-error">Please enter a link.</span>
        </md-field>

        <md-dialog-actions>
          <md-button
            class="md-success md-raised"
            @click="onConfirmApplication();"
            style="background: #00B0A0; color: white; margin: 20px -10px -10px 0;"
          >
            <md-icon style="color: white;">exit_to_app</md-icon>Save
          </md-button>
        </md-dialog-actions>
      </div>
    </md-dialog>

    <div
      id="app"
      style="position: absolute; top: 0; left: 0; width: 20%;  min-height:100vh; max-height: 100vh; overflow: auto;"
    >
      <!--
        ----------------------------------------------------------------------
          TOOLBAR - https://vuematerial.io/components/toolbar/
        ----------------------------------------------------------------------
      -->
      <md-toolbar :class="['md-primary', coherence]">
        <!--
          md-button class="md-icon-button" @click="showNavigation = true;">
            <md-icon>menu</md-icon>
          </md-button
        -->
        <!-- Show the title and navigation path here -->
        <!-- img src="https://diglife.com/brand/logo_primary.svg" / -->
        <span class="md-title">
          <md-icon>timelapse</md-icon>TALKTIME
        </span>
        <md-chip
          v-if="
            status === 'on air' ||
              status === 'check in' ||
              status === 'check out' ||
              status === 'random' ||
              status === 'ping pong'
          "
          style="background-color: #e64d3d !important;"
        >{{ status }}</md-chip>
        <md-chip v-else style="background-color: rgba(255, 255, 255, 0.5) !important;">{{ status }}</md-chip>
        <div style="position: absolute; right: 0px">
          <img title="Remaining talk time" width="30" v-bind:src="battery_bar">
          <img
            title="Topic signal strength"
            style="margin-left: -5px;"
            width="30"
            v-bind:src="signal_bar"
          >
          <img
            title="Balanced talk time"
            style="margin-left: 3px;"
            width="30"
            v-bind:src="wifi_bar"
          >

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

              <md-menu-item @click="activeSetting = true;">
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

              <md-menu-item @click="clear_out();">
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
            >{{ format(time) }}</span>
            <span
              style="position: absolute; right: 40px; margin-top: 3px; font-size: 0.8em"
              v-else
            >{{ format(person.talk_time) }}</span>
            <md-icon>{{ icon[person.status.substring(2)] }}</md-icon>
            {{ person.name }}
            <md-icon v-if="person.mood !== 'mood_panic'">
              {{
              person.mood
              }}
            </md-icon>
            <md-icon v-if="person.mood === 'mood_panic'">healing</md-icon>
            <md-menu
              v-if="person.status.substring(2) !== 'talking' && index !== 0"
              style="padding: 10px;  : pointer;"
            >
              <md-icon md-menu-trigger>more_vert</md-icon>

              <md-menu-content class="md-card-menu">
                <md-menu-item @click="withdraw(person);">
                  <md-icon>cancel</md-icon>
                  <span>Lower Hand</span>
                </md-menu-item>
                <md-menu-item @click="end_distress(person);">
                  <md-icon>healing</md-icon>
                  <span>End Distress</span>
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
          v-bind:class="['bar-button', coherence]"
          v-long-press="interject"
          v-touch:longtap="interject"
          @mousedown="raise_hand"
          :disabled="
            status === 'not started' ||
              status === 'ended' ||
              status === 'ping pong' ||
              status === 'random'
          "
        >
          <md-icon>pan_tool</md-icon>
          <md-icon class="longpress">warning</md-icon>
          <div>RAISE HAND</div>
        </md-button>
        <md-button
          @click="join_call"
          :disabled="
            status === 'not started' ||
              status === 'ended' ||
              status === 'random' ||
              videoLink === ''
          "
          v-bind:class="['bar-button', coherence]"
        >
          <md-icon>videocam</md-icon>
          <div>JOIN CALL</div>
        </md-button>
        <md-button
          @click="on_topic"
          :disabled="
            status === 'not started' ||
              status === 'ended' ||
              status === 'ping pong'
          "
          v-bind:class="['bar-button', coherence]"
        >
          <md-icon>mood</md-icon>
          <div>ON TOPIC</div>
        </md-button>
        <md-button
          v-long-press="onLongPress"
          v-touch:longtap="onLongPress"
          @mousedown="off_topic"
          :disabled="
            status === 'not started' ||
              status === 'ended' ||
              status === 'ping pong'
          "
          v-bind:class="['bar-button', coherence]"
        >
          <md-icon>mood_bad</md-icon>
          <md-icon class="longpress">warning</md-icon>
          <div>OFF TOPIC</div>
        </md-button>
      </div>
    </div>
    <div id="theRoom" v-if="!activeApp" :class="[coherence]">
      <p v-if="videoLink">
        Click
        <a v-bind:href="videoLink" target="_target">Join Call</a> to begin the conference.
      </p>
      <p v-if="!videoLink">
        Please
        <a href="#" @click.prevent="activeSetting=true">set up</a> the video conference link.
      </p>
    </div>

    <div id="actions" v-if="!activeApp">
      <md-button
        v-for="(link, index) in appLinks"
        :key="index"
        @click="openApp(link)"
        v-bind:title="link.menutitle"
        class="md-fab md-mini md-plain"
      >
        <md-icon>{{link.menuicon}}</md-icon>
      </md-button>
      <md-button
        v-if="!activeApp"
        title="Add Menu Entry"
        @click="activeSetting = true;"
        class="md-fab md-mini md-plain"
      >
        <md-icon>add</md-icon>
      </md-button>
    </div>
    <div id="actions" v-if="activeApp">
      <md-button
        v-if="activeApp"
        title="Close App"
        @click="activeApp = false;"
        class="md-fab md-mini md-plain"
      >
        <md-icon>exit_to_app</md-icon>
      </md-button>
    </div>

    <iframe
      :class="[coherence]"
      name="theApp"
      v-if="activeApp"
      src
      id="theApp"
      frameborder="0"
      scrolling="yes"
    ></iframe>
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
    activeApp: false,
    activeSetting: false,
    activeApplication: false,
    menutitle: "",
    menuicon: "",
    power: false,
    snack: "",
    status: "not started",
    coherence: "green",
    variation: 0,
    topic: "",
    time: 0,
    timer: null,
    failed: false,
    username: "",
    domain: "diglife",
    mood: 0,
    battery: 1,
    //duration: 60 * 60 * 2, //in seconds, default is 2 hrs
    meetingDuration: 120,
    moodDuration: 3,
    attendeesRef: "",
    parametersRef: "",
    appLink: "",
    appLinks: [],
    videoLink: "",
    users: [],
    attendees: [{ name: "waiting..", status: "0 standing_by", talk_time: 0 }],
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
      listening: "rgba(180,180,180,0.6)",
      racing: "#e5c62e",
      hiding: "",
      completing: "rgba(180,180,180,0.6)"
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
    this.domain = this.$route.params.domain;
    if (this.domain === "") {
      alert("You must provide a meeting ID in the URL.");
    }

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
      } else if (key === "coherence") {
        this.coherence = data;
      } else if (key === "appLinks") {
        this.activeApp = true;
        this.appLinks = data;

        this.$nextTick(function() {
          var element = document.getElementById("theApp");
          element.src = "about:blank";
          element.style.display = "block";
          window.open(this.appLinks[0].appLink, "theApp");
        });
        this.snack = "Application links loaded.";
        this.showSnackBar = true;
      } else if (key === "appLink") {
        this.activeApp = true;
        this.appLink = data;
        this.snack = "Video link connected.";
        this.showSnackBar = true;

        this.$nextTick(function() {
          var element = document.getElementById("theApp");
          element.src = "about:blank";
          element.style.display = "block";
          window.open(data, "theApp");
        });
      } else if (key === "videoLink") {
        this.videoLink = data;
      }
    });

    this.parametersRef.on("child_changed", meeting => {
      let data = meeting.val();
      let key = meeting.key;
      if (key === "status") {
        this.status = data;
      } else if (key === "coherence") {
        this.coherence = data;
      } else if (key === "videoLink") {
        this.videoLink = data;
      } else if (key === "appLinks") {
        this.activeApp = true;
        this.appLinks = data;
        this.$nextTick(function() {
          var element = document.getElementById("theApp");
          element.src = "about:blank";
          element.style.display = "block";
          window.open(this.appLinks[0].appLink, "theApp");
        });
        this.snack = "Application links loaded.";
        this.showSnackBar = true;
      } else if (key === "appLink") {
        this.activeApp = true;
        this.appLink = data;

        this.$nextTick(function() {
          var element = document.getElementById("theApp");
          element.src = "about:blank";
          element.style.display = "block";
          window.open(data, "theApp");
        });
      }
    });

    ///////////////////////////////////////////////////////////////////
    // LISTEN TO ATTENDEE ADDITIONS
    ///////////////////////////////////////////////////////////////////
    this.attendeesRef.on("child_added", user => {
      let data = user.val();
      this.icon["standing_by"] = "access_time";

      ///////////////////////////////////////////////////////////////////
      // PERSON IS TALKING
      ///////////////////////////////////////////////////////////////////
      // CASE -= Move talker to the top
      if (data.status.substring(2) === "talking") {
        // move standing_by away
        if (this.attendees[0].status.substring(2) === "standing_by") {
          this.attendees[0].status = "6 invisible";
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

      //sort
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
    // ONGOING SORTING  ELIMINATE RACE CONDITIONS
    ///////////////////////////////////////////////////////////////////
    // setInterval(() => {
    //   // this is a brilliant sort function working on 2 keys
    //   // if the status is the same, it sorts by joined_at
    //   // https://stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
    //   if (this.status === "random") {
    //     this.attendees.sort(function(a, b) {
    //       return (
    //         parseInt(a.status.charAt(0), 10) -
    //           parseInt(b.status.charAt(0), 10) || a.random_at - b.random_at
    //       );
    //     });
    //   } else {
    //     this.attendees.sort(function(a, b) {
    //       return (
    //         parseInt(a.status.charAt(0), 10) -
    //           parseInt(b.status.charAt(0), 10) || a.joined_at - b.joined_at
    //       );
    //     });
    //   }
    // }, 500);

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
      console.log(data);
      // retrieve attendee record
      var attendee = {};
      var invisible = {};
      var visible = {};
      var isWaiting = false;
      for (var i = 0; i < this.attendees.length; i++) {
        if (this.attendees[i].name === data.name) {
          this.attendees[i] = data; // overwrite all data change
          attendee = this.attendees[i]; // point to change record
        }
        if (this.attendees[i].status === "6 invisible") {
          invisible = this.attendees[i];
        } else if (this.attendees[i].status === "0 standing_by") {
          visible = this.attendees[i];
        } else if (
          this.attendees[i].status === "3 waiting" ||
          this.attendees[i].status === "2 interjecting"
        ) {
          isWaiting = true;
        }
      }

      if (isWaiting) {
        visible.name = "continue..";
        invisible.name = "continue..";
        this.icon["standing_by"] = "touch_app";
        this.cursor["standing_by"] = "pointer";
      } else {
        visible.name = "waiting..";
        invisible.name = "waiting..";
        this.icon["standing_by"] = "access_time";
        this.cursor["standing_by"] = "default";
      }
      ///////////////////////////////////////////////////////////////////
      // SWITCH STATUS
      ///////////////////////////////////////////////////////////////////
      switch (attendee.status.substring(2)) {
        case "talking":
          visible.status = "6 invisible";
          attendee.started = new Date().getTime();
          this.time = 0;
          clearInterval(this.timer);
          this.timer = setInterval(() => {
            this.time++;
            if (this.attendees[0].name === this.username) {
              this.battery =
                1 -
                (this.time + attendee.talk_time) /
                  (((this.meetingDuration * 60) / this.attendees.length) * 2);
            }
          }, 1000);
          break;

        case "completing":
          if (!isWaiting) {
            this.time = 0;
            invisible.status = "0 standing_by";
          }
          break;

        case "listening":
          if (!isWaiting) {
            this.time = 0;
            invisible.status = "0 standing_by";
          }
          break;

        case "racing":
          if (!isWaiting) {
            this.time = 0;
            invisible.status = "0 standing_by";
          }
          break;

        case "waiting":
          break;
        case "interjecting":
          break;

        case "deleting":
          this.time = 0; // don't stop the timer, useful for a quiet minute
          if (!isWaiting) {
            this.time = 0;
            invisible.status = "0 standing_by";
          }
          this.attendeesRef.child(attendee.name).remove();
          break;

        case "7":
          break;
        case "8":
          break;

        default:
          break;
      }

      ///////////////////////////////////////////////////////////////////
      // PERSON IS ON TOPIC
      // THIS HAS A SIDE EFFECT.... don't change other states
      ///////////////////////////////////////////////////////////////////
      this.mood = 0;
      if (data.mood === "mood") {
        attendee.mood = "mood";
        clearInterval(attendee.mood_timer);
        attendee.mood_timer = setInterval(() => {
          //this.attendeesRef.child(person.name).update({ mood: "" });
          attendee.mood = "";
          this.mood--;
          clearInterval(attendee.mood_timer);
        }, this.moodDuration * 60 * 1000);
      }
      ///////////////////////////////////////////////////////////////////
      // PERSON IS OFF TOPIC
      ///////////////////////////////////////////////////////////////////
      else if (data.mood === "mood_bad") {
        attendee.mood = "mood_bad";
        clearInterval(attendee.mood_timer);
        attendee.mood_timer = setInterval(() => {
          //this.attendeesRef.child(person.name).update({ mood: "" });
          attendee.mood = "";
          this.mood++;
          clearInterval(attendee.mood_timer);
        }, this.moodDuration * 60 * 1000);
      }
      ///////////////////////////////////////////////////////////////////
      // PERSON IS IN PANIC
      ///////////////////////////////////////////////////////////////////
      else if (data.mood === "mood_panic") {
        attendee.mood = "mood_panic";
        clearInterval(attendee.mood_timer);
      }
      ///////////////////////////////////////////////////////////////////
      // PERSON IS BACK TO NORMAL
      ///////////////////////////////////////////////////////////////////
      else {
        attendee.mood = "";
        clearInterval(attendee.mood_timer);
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
      }); // mood

      //sort
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
    }); //child_changed
  },

  ///////////////////////////////////////////////////////////////////
  // VUE MOUNTED
  ///////////////////////////////////////////////////////////////////
  mounted: function() {
    document.title = "TalkTime";

    if (this.$cookies.get("username")) {
      this.username = this.$cookies.get("username");

      // wait for all users to load
      new Promise(resolve => setTimeout(resolve, 1500)).then(resolve => {
        // check if profile exists -- NO PROMISE HERE
        for (var i = 1; i < this.attendees.length; i++) {
          if (this.attendees[i].name === this.username) {
            this.profile = this.attendees[i];
          }
        }

        if (this.profile === undefined) {
          // case: cookie exists and user joins ANOTHER meeting
          this.attendeesRef.child(this.username).update({
            name: this.username,
            status: "4 listening",
            talk_time: 0,
            joined_at: new Date().getTime()
          });
          // case: cookie exists and user has no profile in CURRENT meeting
        }
      });
      // case: cookie does not exist and user joins meeting
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
    // UPDATE COHERENCE
    ///////////////////////////////////////////////////////////////////
    wifi_bar: function() {
      let path = "https://ledger.diglife.coop/images/icons/";
      let timers = [];
      this.attendees.forEach((person, index, arr) => {
        if (index) {
          timers.push(person.talk_time);
        }
      });

      function average(data) {
        var sum = data.reduce(function(sum, value) {
          return sum + value;
        }, 0);
        return sum / data.length;
      }

      let avg = average(timers);
      let variation = timers.map(function(value) {
        return (value - avg) * (value - avg);
      });

      let stdDev = Math.sqrt(average(variation));

      //console.log(timers, stdDev);

      if (stdDev <= 10) {
        return path + "wifi_4.png";
      } else if (stdDev <= 100) {
        return path + "wifi_3.png";
      } else if (stdDev <= 1000) {
        return path + "wifi_2.png";
      } else if (stdDev <= 2000) {
        return path + "wifi_1.png";
      } else if (stdDev <= 8000) {
        return path + "wifi_0.png";
      }
    }
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
          //person.mood = "mood_panic";
          clearInterval(person.mood_timer);
          this.attendeesRef.child(this.username).update({ mood: "mood_panic" });
          this.parametersRef.update({ coherence: "red" });
          this.snack = "Emergency protocol enabled.";
          this.showSnackBar = true;
        }
      });
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
    // FUNCTION SETTINGS
    ///////////////////////////////////////////////////////////////////
    onConfirmSettings: function() {
      if (!this.videoLink) {
        this.activeSetting = true;
        document.getElementById("videoLink").classList.add("md-invalid");
      } else if (!this.meetingDuration) {
        this.activeSetting = true;
        document.getElementById("meetingDuration").classList.add("md-invalid");
      } else if (!this.moodDuration) {
        this.activeSetting = true;
        document.getElementById("moodDuration").classList.add("md-invalid");
      } else {
        this.activeSetting = false;
        document.getElementById("videoLink").classList.remove("md-invalid");
        document
          .getElementById("meetingDuration")
          .classList.remove("md-invalid");
        document.getElementById("moodDuration").classList.remove("md-invalid");

        console.log(this.meetingDuration);
        this.parametersRef.update({
          meetingDuration: this.meetingDuration,
          moodDuration: this.moodDuration,
          videoLink: this.videoLink
        });
      }
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION LONG PRESS
    ///////////////////////////////////////////////////////////////////
    // not used due to Vue acting up on longpress events

    ///////////////////////////////////////////////////////////////////
    // FUNCTION "I AM COMPLETE"
    ///////////////////////////////////////////////////////////////////
    complete: function(person) {
      //console.log(">>>", person);

      var isTalking = this.attendees[0].status.substring(2) === "talking";
      var isWaiting =
        this.attendees[1].status.substring(2) === "waiting" ||
        this.attendees[1].status.substring(2) === "interjecting";

      var isTalkingName = this.attendees[0].name;
      var isWaitingName = this.attendees[1].name;

      var nextstatus = "7 completing";
      if (this.status === "check out") {
        nextstatus = "8 deleting";
      } else if (this.status === "ping pong") {
        nextstatus = "5 racing";
      }
      if (isWaiting && isTalking) {
        this.attendeesRef.child(isTalkingName).update({
          status: nextstatus,
          talk_time: this.attendees[0].talk_time + this.time
        });
        this.attendeesRef.child(isWaitingName).update({ status: "1 talking" });
      } else if (isWaiting && !isTalking) {
        this.attendeesRef.child(isWaitingName).update({ status: "1 talking" });
      } else if (!isWaiting && isTalking) {
        this.attendeesRef.child(isTalkingName).update({
          status: nextstatus,
          talk_time: this.attendees[0].talk_time + this.time
        });
      } else {
        // do nothing
      }

      //sort
      this.attendees.sort(function(a, b) {
        return (
          parseInt(a.status.charAt(0), 10) - parseInt(b.status.charAt(0), 10) ||
          a.joined_at - b.joined_at
        );
      });
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION CHECK IN
    ///////////////////////////////////////////////////////////////////
    check_in: function() {
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
    check_out: function() {
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
    random_round: function() {
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
    ping_pong: function() {
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
    clear_out: function() {
      this.parametersRef.update({ status: "cleared" });
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
    start_meeting: function() {
      this.parametersRef.update({ status: "on air" });
      this.snack = "This meeting has started.";
      this.showSnackBar = true;
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION END MEETING
    ///////////////////////////////////////////////////////////////////
    end_meeting: function() {
      this.parametersRef.update({ status: "ended" });
      this.attendeesRef.remove();
      this.snack = "This meeting has ended.";
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
    // FUNCTION JOIN CALL
    ///////////////////////////////////////////////////////////////////
    join_call: function() {
      this.snack = "Starting the video conference now.";
      this.showSnackBar = true;

      this.$nextTick(function() {
        window.open(this.videoLink, "_target");
      });
      //https://zoom.us/j/2085799929 Diglife
      //https://zoom.us/j/3955362429 Joachim
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
    interject: function() {
      if (this.attendees[0].name !== this.username) {
        this.attendees.forEach(person => {
          //console.log(person);
          if (person.name === this.username) {
            this.attendeesRef.child(person.name).update({
              status: "2 interjecting",
              joined_at: new Date().getTime()
            });
          }
        });

        this.snack = "You are interjecting.";
        this.showSnackBar = true;
      }

      //$event.preventDefault();
      // if (this.attendees[0].name !== this.username) {
      //   this.attendees.forEach(person => {
      //     //console.log(person);
      //     // non-racing case
      //     if (
      //       person.name === this.username &&
      //       person.status.substring(2) !== "racing"
      //     ) {
      //       this.attendeesRef.child(person.name).update({
      //         status: "2 interjecting",
      //         joined_at: new Date().getTime()
      //       });
      //     } else if (
      //       person.name === this.username &&
      //       person.status.substring(2) === "racing"
      //     ) {
      //       this.failed = false;
      //       this.attendeesRef
      //         .once("value", attendees => {
      //           attendees.forEach(snapshot => {
      //             let data = snapshot.val();
      //             if (data.status.substring(2) === "talking") {
      //               this.failed = true;
      //             }
      //           });
      //         })
      //         .then(
      //           this.failed
      //             ? null
      //             : this.attendeesRef.child(person.name).update({
      //                 status: "1 talking",
      //                 joined_at: new Date().getTime()
      //               })
      //         );
      //     }
      //   });

      //console.log(this.attendees);
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
    // FUNCTION END DISTRESS
    ///////////////////////////////////////////////////////////////////
    end_distress: function(person) {
      this.attendeesRef.child(person.name).update({ mood: "" });
      this.parametersRef.update({ coherence: "green" });
      this.snack = "Emergency protocol disabled.";
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
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION OPEN APP
    ///////////////////////////////////////////////////////////////////
    openApp: function(app) {
      this.activeApp = true;

      this.$nextTick(function() {
        var element = document.getElementById("theApp");
        element.src = "about:blank";
        element.style.display = "block";
        window.open(app.appLink, "theApp");
      });
    },

    ///////////////////////////////////////////////////////////////////
    // FUNCTION CREATE NOTE
    ///////////////////////////////////////////////////////////////////
    createNote: function(type) {
      let clipboard = document.getElementById("Clipboard");
      switch (type) {
        case "plain":
          clipboard.value =
            "# Title goes here\n" +
            "## Subtitle goes here\n" +
            "\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\n" +
            ":::warning\n" +
            "###### tags: `plain`" +
            "\n###### authors: `" +
            this.$cookies.get("username") +
            "`\n:::" +
            "";
          break;
        case "meeting":
          clipboard.value =
            "#  :video_camera: Meeting Agenda & Notes\n" +
            "## ```" +
            Moment().format("LLLL") +
            "```\n" +
            ":warning: Please record the call and post the [link to the recording here](https://wherever.com).\n" +
            "### :eyes: Participants\n" +
            "Chair:\nScribe:\nAttendees:\nApologies:\n" +
            "### :heavy_check_mark: Meeting Checklist\n" +
            "- [x] Did you change access to this file to 'Freely' (top right)?\n" +
            "- [ ] Did you appoint a chair and note-taker for this meeting?\n" +
            "- [ ] Did you start the recording and announce the call will be recorded & posted publicly?\n" +
            "- [ ] Did you allow for short [check-ins and/or check-outs](https://toolbox.hyperisland.com/check-in-questions)?\n" +
            "- [ ] Did you post the recording and created a link above in the note?\n" +
            "### :alarm_clock: Meeting Agenda\n" +
            "- [x] \n" +
            "- [ ] \n" +
            "- [ ] \n" +
            "### :memo: Meeting Notes\n" +
            "Please update this section during the meeting; you can edit this content concurrently.\n" +
            "- [x] \n" +
            "- [ ] \n" +
            "- [ ] \n" +
            "### :clapper: Actions & Decisions\n" +
            "Please record any actions and/or decisions from the meeting; attach names & dates and check off items completed, if possible.\n" +
            "- [x] \n" +
            "- [ ] \n" +
            "- [ ] \n" +
            ":::warning\n" +
            "###### tags: `meeting`" +
            "\n###### authors: `" +
            this.$cookies.get("username") +
            "`\n:::" +
            "";
          break;
        case "news":
          clipboard.value =
            "#  :newspaper: Newsletter Topics\n" +
            "Please contribute to our newsletter and fill out one of the sections below.\n" +
            "### :calendar: Campaign Info\n" +
            "Launch Date:\nTarget Audience:\nNewsletter Editors:\n" +
            "### :tada: Topic 1\n" +
            "Author: ```name```\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n" +
            "### :tada: Topic 2\n" +
            "Author: ```name```\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n" +
            "### :tada: Topic 3\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n" +
            "Author: ```name```\n" +
            "### :tada: Topic 4\n" +
            "Author: ```name```\n" +
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n" +
            ":::warning\n" +
            "###### tags: `news`" +
            "\n###### authors: `" +
            this.$cookies.get("username") +
            "`\n:::" +
            "";
          break;
        default:
          break;
      }

      clipboard.focus();
      clipboard.select();
      document.execCommand("copy");
      this.activeApp = true;
      this.snack =
        "Template copied to clipboard. Please paste it into the new file.";
      this.showSnackBar = true;

      this.$nextTick(function() {
        var element = document.getElementById("theApp");
        element.src = "about:blank";
        element.style.display = "block";
        window.open("https://notepad.diglife.coop/new", "theApp");
      });
    }
  }
};
</script>

<style>
/*
   LAYOUT STYLES
   HONOR 8 = 1080x1920
*/

@media only screen and (max-width: 1080px) {
  #theApp,
  #theRoom {
    display: none !important;
  }
  #actions {
    display: none !important;
  }
  #app {
    width: 100% !important;
  }
}
/*
@media only screen and (max-width: 400px) {
  .md-button.bar-button {
    width: 100% !important;
  }
  span.md-title {
    display: none !important;
  }
}
*/
@media only screen and (min-width: 1080px) and (max-width: 1780px) {
  .md-button.bar-button {
    width: 100% !important;
  }
  span.md-title {
    display: none !important;
  }
}

#theRoom {
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  min-height: 100vh;
  max-height: 100vh;
  overflow: auto;
  text-align: center;
  font-size: 5em;
  line-height: 1.2em;
  color: white;
  padding: 25%;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)),
    url("https://ledger.diglife.coop/images/talktime/talkTimeSplash.jpg");
  background-size: cover;
  background-position: center bottom;
  background-repeat: no-repeat;
}

#theApp {
  position: absolute;
  top: 0;
  right: 0;
  width: 80%;
  min-height: 100vh;
  max-height: 100vh;
  overflow: auto;
}

.md-speed-dial {
  position: absolute !important;
  bottom: 20px;
  right: 20px;
  z-index: 299;
}
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
  background-color: #eee !important;
  background-image: url("https://diglife.com/brand/logo_secondary.svg");
  background-size: cover;
  background-size: 80%;
  background-position: center center;
  background-repeat: no-repeat;
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
  margin: 30px -30px 0 0 !important;
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

#actions {
  position: absolute;
  margin: auto;
  bottom: 40%;
  z-index: 99;
  width: 45px;
  right: 20px;
}
#actions .md-button {
  margin-left: 0;
  background-color: #e5c62e !important;
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

.bar-button.red:hover {
  background: #e64d3d !important;
}
.bar-button.yellow:hover {
  background: #e5c62e !important;
}
.bar-button.green:hover {
  background: #41b883 !important;
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
  left: 0px !important;
  width: 20%;
}

li {
  transition: all 0.5s ease-out;
}
</style>
