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
        DIALOG BOXES - TOPICS DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog :md-active.sync="activeDialog">
      <md-dialog-title>Add Topic</md-dialog-title>
      <div style="padding: 20px;">
        <md-field>
          <label>Topic</label>
          <md-input v-model="topic"></md-input>
          <span class="md-helper-text">Enter a topic</span>
        </md-field>
      </div>
      <md-button type="submit" class="md-primary">Add Topic</md-button>
    </md-dialog>

    <!--
      md-button
        v-if="!activeDialog"
        @click="
          activeDialog = true;
          add_topic();
        "
        class="md-fab md-primary"
        style="background-color:#e91e63; position: absolute; bottom: 90px; right: 10px; z-index: 99"
      >
        <md-icon>add</md-icon>
      </md-button
    -->

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
        v-if="status == 'on air'"
        style="background-color: #e64d3d !important;"
        >{{ status }}</md-chip
      >
      <md-chip
        v-else
        style="background-color: rgba(255, 255, 255, 0.4) !important;"
        >{{ status }}</md-chip
      >
      <div style="position: absolute; right: 0px">
        <img
          style=""
          width="30"
          src="https://ledger.diglife.coop/images/icons/battery_80.png"
        />
        <img
          style=""
          width="30"
          src="https://ledger.diglife.coop/images/icons/signal_3_bar.png"
        />

        <md-menu style="padding: 10px; cursor: pointer;">
          <md-icon md-menu-trigger>more_vert</md-icon>

          <md-menu-content class="md-card-menu">
            <md-menu-item @click="start_meeting();">
              <md-icon>power_settings_new</md-icon>
              <span>Start Meeting</span>
            </md-menu-item>

            <md-menu-item @click="end_meeting();">
              <md-icon>power_settings_new</md-icon>
              <span>End Meeting</span>
            </md-menu-item>

            <md-menu-item @click="check_in();">
              <md-icon>update</md-icon>
              <span>Check-in</span>
            </md-menu-item>

            <md-menu-item @click="check_out();">
              <md-icon>update</md-icon>
              <span>Check-out</span>
            </md-menu-item>

            <md-menu-item @click="round_robin();">
              <md-icon>update</md-icon>
              <span>Round Robin</span>
            </md-menu-item>

            <md-menu-item @click="round_robin();">
              <md-icon>update</md-icon>
              <span>Random Round</span>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </div>
    </md-toolbar>

    <!--
      ----------------------------------------------------------------------
        DRAWER MENU BAR - https://vuematerial.io/components/drawer
      ----------------------------------------------------------------------
    -->
    <!--
      md-drawer :md-active.sync="showNavigation" id="drawer">
      <md-toolbar
        class="md-transparent"
        md-elevation="0"
        :class="['md-primary']"
      >
      </md-toolbar
    -->

    <!--
      ----------------------------------------------------------------------
        LIST - https://vuematerial.io/components/list/
      ----------------------------------------------------------------------
    -->
    <!--
      md-list>
          <md-list-item>
            <md-icon>person</md-icon>
            <span class="md-list-item-text">text</span>
          </md-list-item>
        </md-list>
      </md-drawer
    -->

    <!--
      ----------------------------------------------------------------------
        PAGE CONTENT
      ----------------------------------------------------------------------
    -->
    <md-content class="md-scrollbar">
      <ul>
        <li
          v-for="(person, index) in attendees"
          :key="index"
          @click="complete(person);"
          v-bind:style="[
            {
              backgroundColor: color[person.status.substring(2)],
              cursor: cursor[person.status.substring(2)]
            }
          ]"
        >
          <md-icon>{{ icon[person.status.substring(2)] }}</md-icon>
          {{ person.name }}
          <md-menu
            v-if="person.status !== 'talking'"
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

      <div class="bottom-bar">
        <md-button
          @click="raise_hand(attendees[4]);"
          :disabled="status === 'not started' || status === 'ended'"
          class="bar-button"
          ><md-icon>pan_tool</md-icon>
          <div>RAISE HAND</div></md-button
        >
        <md-button
          @click="interject(attendees[4]);"
          :disabled="status === 'not started' || status === 'ended'"
          class="bar-button"
          ><md-icon>warning</md-icon>
          <div>INTERJECT</div></md-button
        >
        <md-button
          @click="interject(attendees[4]);"
          :disabled="status === 'not started' || status === 'ended'"
          class="bar-button"
          ><md-icon>mood</md-icon>
          <div>ON TOPIC</div></md-button
        >
        <md-button
          @click="interject(attendees[4]);"
          :disabled="status === 'not started' || status === 'ended'"
          class="bar-button"
          ><md-icon>mood_bad</md-icon>
          <div>OFF TOPIC</div></md-button
        >
      </div>
    </md-content>
  </div>
  <!-- END page-container md-layout-column -->
</template>

<script>
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
    activeDialog: false,
    power: false,
    snack: "",
    status: "not started",
    action: "none",
    topic: "",
    attendees: [
      { name: "standing by...", status: "0 standing_by", talk_time: 0 },
      { name: "joshua", status: "1 waiting", talk_time: 0 },
      { name: "klaus", status: "4 waiting", talk_time: 0 },
      { name: "sam", status: "4 waiting", talk_time: 0 },
      { name: "tammy", status: "4 listening", talk_time: 0 },
      { name: "colin", status: "4 listening", talk_time: 0 },
      { name: "heiner", status: "4 listening", talk_time: 0 },
      { name: "heidi", status: "4 listening", talk_time: 0 }
    ],
    icon: {
      standing_by: "access_time", // #0
      talking: "record_voice_over", // #1
      interjecting: "warning", // #2
      waiting: "pan_tool", // #3
      listening: "hourglass_empty", // #4
      completing: "check_circle_outline" // #5
    },
    color: {
      standing_by: "#e5c62e", // #0
      talking: "#2ccd70", // #1
      interjecting: "#e64d3d", // #2
      waiting: "#3598db", // #3
      listening: "#ccc", // #4
      completing: "#ccc" // #5
    },
    cursor: {
      standing_by: "pointer",
      talking: "pointer",
      interjecting: "default",
      waiting: "default",
      listening: "default",
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
  mounted: function() {},

  computed: {},
  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    // is member
    start_meeting: function(meeting) {
      this.status = "on air";
      this.snack = "This meeting has started";
      this.showSnackBar = true;
    },
    end_meeting: function(meeting) {
      this.status = "ended";
      this.snack = "This meeting has ended";
      this.showSnackBar = true;
    },
    raise_hand: function(person) {
      person.status = "3 waiting";
      this.snack = "You have raised your hand.";
      this.showSnackBar = true;
      this.attendees.sort(
        (a, b) => (a.status > b.status) - (a.status < b.status)
      );
    },
    complete: function(person) {
      if (person.status === "0 standing_by") {
        person.status = "6 invisible";
      } else {
        person.status = "5 completing";
      }
      this.attendees.sort(
        (a, b) => (a.status > b.status) - (a.status < b.status)
      );
      console.log(this.attendees);
      if (this.attendees[0].status.substring(2) === "waiting") {
        this.attendees[0].status = "1 talking";
      } else {
        // move standing_by to top
      }
    },
    appoint: function(person) {
      person.status = "1 talking";
      this.snack = "You have appointed " + person.name + ".";
      this.showSnackBar = true;
    },
    withdraw: function(person) {
      person.status = "4 listening";
      this.snack = "You have withdrawn " + person.name + ".";
      this.showSnackBar = true;
      this.action = "reject";
    },
    interject: function(person) {
      person.status = "2 interjecting";
      this.snack = "You are interjecting.";
      this.showSnackBar = true;
    },
    on_topic: function(topic) {
      person.status = "on_topic";
      this.snack = "You are bored.";
      this.showSnackBar = true;
    },
    off_topic: function(topic) {
      person.status = "off_topic";
      this.snack = "You are interested.";
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
.md-content ul {
  margin: 0;
  padding: 0;
}

.md-content li:first-child {
  margin: 4px 0 10px;
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

.md-button div {
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
  background-color: #ccc !important;
  border: 1px solid white;
  cursor: not-allowed;
}
</style>
