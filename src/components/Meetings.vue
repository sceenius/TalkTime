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
        DIALOG BOXES - SETTINGS DIALOG
      ----------------------------------------------------------------------
    -->
    <md-dialog :md-active.sync="activeSettings" style="padding: 20px;">
      <md-dialog-title style="padding: 0px; color: #404040 !important;"
        >My Profile</md-dialog-title
      >
      <Tags />
    </md-dialog>

    <!--
      ----------------------------------------------------------------------
        TOOLBAR - https://vuematerial.io/components/toolbar/
      ----------------------------------------------------------------------
    -->
    <md-toolbar :class="['md-primary']">
      <md-button class="md-icon-button" @click="showNavigation = true;">
        <md-icon>menu</md-icon>
      </md-button>
      <!-- Show the title and navigation path here -->
      <!-- img src="https://diglife.com/brand/logo_primary.svg" / -->
      <span class="md-title">TALK TIME</span>

      <div style="position: absolute; right: 0px">
        <img
          style="padding: 0px; margin: 0 0 10px 10px;"
          width="30"
          src="https://ledger.diglife.coop/images/icons/battery_80.png"
        />
        <img
          style="padding: 0px; margin: 0 10px 10px 0px;"
          width="30"
          src="https://ledger.diglife.coop/images/icons/signal_3_bar.png"
        />
        <md-switch v-model="power" value="1"></md-switch>
      </div>
    </md-toolbar>

    <!--
      ----------------------------------------------------------------------
        DRAWER MENU BAR - https://vuematerial.io/components/drawer
      ----------------------------------------------------------------------
    -->
    <md-drawer :md-active.sync="showNavigation" id="drawer">
      <md-toolbar
        class="md-transparent"
        md-elevation="0"
        :class="['md-primary']"
      >
      </md-toolbar>

      <!--
        ----------------------------------------------------------------------
          LIST - https://vuematerial.io/components/list/
        ----------------------------------------------------------------------
      -->
      <md-list>
        <md-list-item>
          <md-icon>person</md-icon>
          <span class="md-list-item-text">text</span>
        </md-list-item>
      </md-list>
    </md-drawer>

    <!--
      ----------------------------------------------------------------------
        PAGE CONTENT
      ----------------------------------------------------------------------
    -->
    <md-content class="md-scrollbar">
      <p><md-icon style="color: white">record_voice_over</md-icon> Joshua</p>
      <p><md-icon style="color: white">pan_tool</md-icon> Colin</p>
      <p><md-icon style="color: white">pan_tool</md-icon> Sam</p>
      <div class="phone-viewport">
        <md-bottom-bar style="">
          <md-bottom-bar-item
            md-label="Raise Hand"
            md-icon="pan_tool"
          ></md-bottom-bar-item>
          <md-bottom-bar-item
            md-label="Next"
            md-icon="record_voice_over"
          ></md-bottom-bar-item>
          <md-bottom-bar-item
            md-label="On Target"
            md-icon="mood"
          ></md-bottom-bar-item>
          <md-bottom-bar-item
            md-label="Off Target"
            md-icon="mood_bad"
          ></md-bottom-bar-item>
        </md-bottom-bar>
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
    activeSettings: false,
    power: false,
    snack: ""
  })
};
</script>

<style>
.md-content p {
  padding: 15px;
  margin: 4px;
  font-size: 1.6em;
  width: 100%;
  display: block;
  color: white;
  border: 1px solid white;
  background-color: #2ccd70;
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
  font-size: 1.2em;
}

.md-active .md-icon,
.md-active {
  color: #2ccd70 !important;
}
.phone-viewport {
  position: absolute;
  bottom: 0px;
  width: 100%;
}
</style>
