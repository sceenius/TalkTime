<template>
  <div class="page-container md-layout-column">
    <!--
      ----------------------------------------------------------------------
        SNACKBARS  - https://vuematerial.io/components/snackbar
      ----------------------------------------------------------------------
    -->
    <md-snackbar
      :md-duration="4000"
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

    <md-button
      v-if="!activeDialog"
      @click="
        activeDialog = true;
        add_topic();
      "
      class="md-fab md-primary"
      style="background-color:#e91e63; position: absolute; bottom: 90px; right: 10px; z-index: 99"
    >
      <md-icon>add</md-icon>
    </md-button>

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
      <span class="md-title">TALK TIME</span>
      <md-chip
        v-if="status == 'on air'"
        style="background-color: #e64d3d !important;"
        >{{ status }}</md-chip
      >
      <md-chip
        v-if="status == 'not started'"
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
          v-bind:style="[{ backgroundColor: colors[index] }]"
        >
          <md-icon v-if="index == 0">record_voice_over</md-icon>
          <md-icon v-if="index > 0">pan_tool</md-icon> {{ person }}
          <md-menu style="padding: 10px; cursor: pointer;">
            <md-icon md-menu-trigger>more_vert</md-icon>

            <md-menu-content class="md-card-menu">
              <md-menu-item @click="withdraw();">
                <md-icon>cancel</md-icon>
                <span>Withdraw</span>
              </md-menu-item>
            </md-menu-content>
          </md-menu>
        </li>
      </ul>

      <md-bottom-bar style="">
        <md-bottom-bar-item
          @click="raise_hand();"
          md-label="Raise Hand"
          md-icon="pan_tool"
        ></md-bottom-bar-item>
        <md-bottom-bar-item
          @click="interject();"
          md-label="Interject"
          md-icon="warning"
        ></md-bottom-bar-item>
      </md-bottom-bar>
      <md-bottom-bar style="right:0px;">
        <md-bottom-bar-item
          @click="on_topic();"
          md-label="On Topic"
          md-icon="mood"
        ></md-bottom-bar-item>
        <md-bottom-bar-item
          @click="off_topic();"
          md-label="Off Topic"
          md-icon="mood_bad"
        ></md-bottom-bar-item>
      </md-bottom-bar>
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
    topic: "",
    attendees: [
      "Joshua",
      "Klaus",
      "Sam",
      "Tammy",
      "Jazwinder",
      "Heiner",
      "Heidi"
    ],
    colors: [
      "#AAE0FA",
      "#D8DF20",
      "#FFCA08",
      "#ED008C",
      "#01ABCE",
      "#71BF45",
      "#F7941D",
      "#D41E4E",
      "#00A65E",
      "#F25822",
      "#AC54A0",
      "#5C2E91"
    ]
  }),
  ///////////////////////////////////////////////////////////////////////////////
  //  CREATED - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  created: function() {},
  ///////////////////////////////////////////////////////////////////////////////
  //  METHODS - https://vuejs.org/v2/guide/instance.html
  ///////////////////////////////////////////////////////////////////////////////
  methods: {
    // is member
    start_meeting: function() {
      this.status = "on air";
      this.snack = "This meeting has started";
      this.showSnackBar = true;
    },
    end_meeting: function() {
      this.status = "ended";
      this.snack = "This meeting has ended";
      this.showSnackBar = true;
    }
  }
};
</script>

<style>
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

.md-bottom-bar {
  position: absolute;
  bottom: 0px;
  width: 50%;
}

.md-bottom-bar .md-icon {
  color: white !important;
  font-size: 3em !important;
  margin: 10px !important;
}

.md-bottom-bar-item {
  color: white !important;
  background: black !important;
  border: 1px solid gray;
  height: 80px !important;
}
.md-bottom-bar-label {
  font-size: 1em;
}

.md-active .md-icon,
.md-active {
  color: #2ccd70 !important;
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
</style>
