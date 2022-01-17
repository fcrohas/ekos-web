<template>
  <el-container>
    <el-container>
      <el-main>
        <el-row>
          <el-col :span="24">
            <NavBar @change-mode="onChangeMode"/>
            <!--State class="state-overlay"></State-->
            <Viewer></Viewer>
            <Guider width="400" heigth="200" :mode="mode"></Guider>
            <Toolbar :mode="mode"></Toolbar>
            <Information :mode="mode"></Information>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import NavBar from "@/components/NavBar";
//import State from "@/components/State";
import Guider from "@/components/Guider";
import Viewer from "@/components/Viewer";
import Toolbar from "@/components/Toolbar";
import Information from "@/components/Information";
import SocketUi from "@/services/websocket";

export default {
  name: 'Main',
  components: {
    Toolbar,
    NavBar,
    //State,
    Guider,
    Viewer,
    Information
  },
  computed : {
  },
  data() {
    return {
      mode : 'none'
    }
  },
  methods: {
    onChangeMode(mode) {
      console.log("new mode=", mode)
      this.mode = mode
    }
  },
  created() {
    // Dummy initialize websocket instance
    SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
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
</style>
