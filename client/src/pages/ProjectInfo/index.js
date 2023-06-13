import { message, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GetProjectById } from "../../apicalls/projects";
import { GetAllTasks } from "../../apicalls/tasks";
import Divider from "../../components/Divider";
import { SetLoading } from "../../redux/loadersSlice";
import { getDateFormat } from "../../utils/helpers";
import Members from "./Members";
import Tasks from "./Tasks";

function ProjectInfo() {

  const [currentUserRole, setCurrentUserRole] = useState("");
  const { user } = useSelector((state) => state.users);
  const [project, setProject] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectById(params.id);
      dispatch(SetLoading(false));
      if (response.success) {
        setProject(response.data);
        const currentUser = response.data.members.find(
          (member) => member.user._id === user._id
        );

        const formattedRole = currentUser.role === 'employee' ? 'FUNCIONÁRIO' : 'PROPRIETÁRIO'

        setCurrentUserRole(formattedRole);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };



  useEffect(() => {
    getData();

  }, []);

  return (
    project && (
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-primary text-2xl font-semibold uppercase">
              {project?.name}
            </h1>
            <span className="text-gray-600 text-sm">
              {project?.description}
            </span>
            <div className="flex gap-5">
              <span className="text-gray-600 text-sm font-semibold">Role</span>
              <span className="text-gray-600 text-sm uppercase">
                {currentUserRole}
              </span>
            </div>
          </div>
          <div>
            <div className="flex gap-5">
              <span className="text-gray-600 text-sm font-semibold">
                Criado em
              </span>
              <span className="text-gray-600 text-sm">
                {getDateFormat(project.createdAt)}
              </span>
            </div>
            <div className="flex gap-5">
              <span className="text-gray-600 text-sm font-semibold">
                Criado por
              </span>
              <span className="text-gray-600 text-sm">
                {project.owner.firstName} {project.owner.lastName}
              </span>
            </div>
          </div>
        </div>

        <Divider />

        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tarefas" key="1">
            <Tasks project={project} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Membros" key="2">
            <Members project={project} reloadData={getData} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  );
}

export default ProjectInfo;
