<template>
  <el-container>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24">
            <div v-if="online">
              <NavBar @change-mode="onChangeMode"/>
              <!--State class="state-overlay"></State-->
              <Viewer :mode="mode"></Viewer>
              <Guider width="400" heigth="200" :show="showGuider"></Guider>
              <Toolbar :mode="mode" @show-guider="onShowGuider"></Toolbar>
              <!--Information :mode="mode"></Information-->
              <MainTool :mode="mode"></MainTool>
            </div>
            <div v-if="!online">
              <div ref="profile" class="profiles">
                <el-select v-model="selectedProfile" class="m-2" placeholder="Profiles" size="large">
                  <el-option
                      v-for="profile in profiles"
                      :key="profile.name"
                      :label="profile.name"
                      :value="profile.name"
                  >
                  </el-option>
                </el-select>
                <el-button class="big-button" :icon="SwitchButton" @click="startProfile()"></el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
/* eslint-disable vue/no-unused-components */
import {
  SwitchButton
} from '@element-plus/icons'
</script>
<script>

import NavBar from "@/components/NavBar";
//import State from "@/components/State";
import Guider from "@/components/Guider";
import Viewer from "@/components/Viewer";
import Toolbar from "@/components/Toolbar";
//import Information from "@/components/Information";
import SocketUi from "@/services/websocket";
import States from "@/services/states";
import ProfileApi from "@/services/profile-api.js";
import MainTool from "@/components/MainTool";

export default {
  name: 'Main',
  components: {
    MainTool,
    Toolbar,
    NavBar,
    //State,
    Guider,
    Viewer
    //Information
  },
  computed : {
  },
  data() {
    return {
      mode : 'capture',
      showGuider: false,
      states: States.getInstance(),
      selectedProfile: '',
      profiles: [],
      online : false,
      margin: 0
    }
  },
  methods: {
    onChangeMode(mode) {
      console.log("new mode=", mode)
      this.mode = mode
    },
    onShowGuider(visible) {
      console.log("guider", visible)
      this.showGuider = visible
    },
    getProfiles() {
      ProfileApi.list().then( (response) => {
        this.profiles = response.data.profiles
        this.selectedProfile = response.data.selectedProfile
      })
    },
    onConnectionChange(data) {
      this.online = data.online
    },
    startProfile() {
      ProfileApi.start(this.selectedProfile)
    },
    handleResize() {
      // Calculate new canvas size based on window
      // const canvasSize = this.canvas.parentNode
      // this.ctx.canvas.width = canvasSize.clientWidth
      // this.ctx.canvas.height = canvasSize.clientHeight
      this.$refs.profile.height = window.innerHeight - this.margin;
      this.$refs.profile.width = window.innerWidth - this.margin;
    }
  },
  mounted() {
    this.getProfiles()
    window.addEventListener('resize', this.handleResize);
    this.$refs.profile.height = window.innerHeight - this.margin;
    this.$refs.profile.width = window.innerWidth - this.margin;
    console.log(this.$refs.profile)
  },
  created() {
    // Dummy initialize websocket instance
    SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
    States.getInstance().registerEvent('new_connection_state', this.onConnectionChange)
  }

}
</script>

<style  scoped>
.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  text-align: center;
}

.state-overlay {
  position: absolute;
  z-index: 10;
  left: 0px;
}

.profiles {
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: black;
}

.big-button, .big-button:focus {
  background: transparent;
  color: white;
  border: none;
  font-size: 8em;
  border: none;
}

.big-button:hover {
  color: white;
  background-color: transparent;
}
</style>
