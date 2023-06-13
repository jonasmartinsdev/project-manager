import React from "react";
import { Tabs } from "antd";
import Projects from "./Projects";

function Profile() {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Projetos" key="1">
        <Projects />
      </Tabs.TabPane>
      {/* <Tabs.TabPane tab="Geral" key="2">
        Geral
      </Tabs.TabPane> */}
    </Tabs>
  );
}

export default Profile;
