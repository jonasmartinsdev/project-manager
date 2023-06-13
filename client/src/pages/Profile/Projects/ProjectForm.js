import { Form, Input, message, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { CreateProject, EditProject } from "../../../apicalls/projects";

function ProjectForm({ show, setShow, reloadData, project }) {
  const formRef = React.useRef(null);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (project) {
        // edit project
        values._id = project._id;
        response = await EditProject(values);
      } else {
        // create project
        values.owner = user._id;
        values.members = [
          {
            user: user._id,
            role: "owner",
          },
        ];
        response = await CreateProject(values);
      }

      if (response.success) {
        message.success(response.message);
        reloadData();
        setShow(false);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
    }
  };
  return (
    <Modal
      title={project ? "EDITAR PROJETO" : "CRIAR PROJETO"}
      open={show}
      onCancel={() => setShow(false)}
      centered
      width={700}
      onOk={() => {
        formRef.current.submit();
      }}
      okText="Salvar"
    >
      <Form
        layout="vertical"
        ref={formRef}
        onFinish={onFinish}
        initialValues={project}
      >
        <Form.Item label="Nome do Projeto" name="name">
          <Input placeholder="Nome do Projeto" />
        </Form.Item>
        <Form.Item label="Descrição do Projeto" name="description">
          <TextArea placeholder="Descrição do Projeto" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProjectForm;
