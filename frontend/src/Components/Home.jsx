import React, { useState, useEffect } from "react";
import "./Css/Home.css";
import { Modal } from "antd";
import {
  Form,
  Input,
  Button,
  Spin,
  Tooltip,
  notification,
  Table,
  Select,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import axios from "axios";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const Home = () => {
  const [loader, setLoader] = useState(false);
  const [employeeID, setemployeeID] = useState("");
  const [fullname, setfullname] = useState("");
  const [EmployeeType, setEmployeeType] = useState("");
  const [Designation, setDesignation] = useState("");
  const [namewithini, setNamewithini] = useState("");
  const [dateofbirth, setDateofbirth] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [salary, setSalary] = useState("");
  const [joineddate, setJoineddate] = useState("");
  const [personalnotes, setPersonalnotes] = useState("");
  const [displayname, setdisplayname] = useState("");
  const [Experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false); //additional
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isselected, setIsselected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialDetails, setInitialDetails] = useState({});



  //Delete Employee
  const deleteFunc = async (id) => {
    await axios.delete(`http://localhost:5000/api/Employee/${id}`).then(() => {
      notification.info({ message: "Successfully Deleted", placement: "top" });
      setSuccess(true);
    });
  };


  const columns = [
    {
      title: "Display Name ",
      dataIndex: "displayname",
      defaultSortOrder: "descend",
      onFilter: (value, record) => record.displayname.indexOf(value) === 0,
      sorter: (a, b) => a.displayname.length - b.displayname.length,
      sortDirections: ["descend"],
    },
    {
      title: "Emp ID",
      dataIndex: "employeeID",
      render: (_, record) => {
        let pattern;
        if (parseInt(record.employeeID) < 10) {
          pattern = "000";
        } else if (
          parseInt(record.employeeID) >= 10 ||
          parseInt(record.employeeID) < 100
        ) {
          pattern = "00";
        }

        return <div>{`${pattern}${record.employeeID}`}</div>;
      },
    },
    {
      title: "Designation",
      dataIndex: "Designation",
    },
    {
      title: "Emp. Type",
      dataIndex: "EmployeeType",
    },
    {
      title: "Experience",
      dataIndex: "Experience",
    },

    {
      title: " ",
      render: (_, record) => (
        <div className="delete_edit">
          <div>
            <a
              onClick={() => {
                setInitialDetails(record);
                setOpen(true);
              }}
              style={{ fontSize: "12px", color: "blue" }}
            >
              Edit
            </a>
          </div>
          <div>
            <a
              onClick={() => deleteFunc(record._id)}
              style={{ fontSize: "12px", color: "red" }}
            >
              Delete
            </a>
          </div>
        </div>
      ),
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };



// Update Employee
  const update = (values) => {
    setOpen(true);
    axios
      .put(`http://localhost:5000/api/Employee/${{ ...initialDetails }._id}`, {
        ...values,
        EmployeeType:EmployeeType ? EmployeeType : initialDetails.EmployeeType,
        gender:gender ? gender : initialDetails.gender,
        Experience: Experience ? Experience : initialDetails.Experience,
      })
      .then((res) => {
        notification.info({
          message: "Successfully Updated",
          placement: "top",
        });
        setSuccess(true);
        setOpen(false)
      });
  };

  //Render Employee details page-load
  useEffect(() => {
    if (!success)
      setTimeout(() => {
        setLoader(!loader);
      }, 5000);

    (async () =>
      fetch("http://localhost:5000/api/Employee")
        .then((res) => res.json())
        .then((json) => {
          setData(json);
        }))();
    setIsselected(false);
    setSuccess(false);
  }, [success]);

  useEffect(() => {
    if (isselected) {
      (async () =>
        fetch("http://localhost:5000/api/Employee")
          .then((res) => res.json())
          .then((json) => {
            setData(
              json.filter((data) => {
                return data.EmployeeType === selectedOption;
              })
            );
          }))();
    }
    setIsselected(false);
  }, [isselected]);

  const CreateHandler = async (placement) => {
    // create handler for saving data to the db
    setLoading(true);

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      await axios
        .get("http://localhost:5000/api/Employee")
        .then(async (res) => {
          await axios.post(
            "http://localhost:5000/api/Employee/Create",
            {
              employeeID:
                !res.data || !res.data.length
                  ? 1
                  : parseInt([...res.data].pop().employeeID) + 1,
              EmployeeType,
              displayname,
              Designation,
              Experience,
              fullname,
              namewithini,
              gender,
              email,
              joineddate,
              salary,
              personalnotes,
              dateofbirth,
              mobile,
            },
            config
          );
          setSuccess(true);
          setOpen(false);
        });

      setTimeout(() => {
        //set a time out
        setLoading(false);
        notification.info({
          message: `Notification`,
          description: "Successfully Submitted the Employee details ",
          placement,
        });
        form.resetFields();
      }, 5000); //5seconds timeout
    } catch (error) {
      notification.error({
        message: `Notification`,
        description: error.response.data.error,
        placement,
      });
      setError(true);
      form.resetFields();
      setLoading(false);
    }
  };

  const [form] = Form.useForm();
  const { Option } = Select;

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setIsselected(true);
  };

  return (
    <>
      <>
        <select
          defaultValue="Employee Type"
          className="select"
          onChange={handleSelectChange}
        >
          <option value="Full time">Full time</option>
          <option value="Part time">Part time</option>
          <option value="Contract Basis">Contract Basis</option>
          <option value="Other">Other</option>
        </select>

        <Button
          className="button-add"
          type="primary"
          onClick={() => setOpen(true)}
        >
          Add People
        </Button>

        <Modal
          title={
            Object.keys(initialDetails).length ? "Edit People" : "Add People"
          }
          centered
          okText={
            Object.keys(initialDetails).length ? "Edit People" : "Add People"
          }
          open={open}
          onOk={() => {
            if (
              form.validateFields().then(() => {
                form.submit();
              })
            );
          }}
          onCancel={() => setOpen(false)}
          width={830}
        >
          <Form
            {...layout}
            form={form}
            name="control-hooks"
            onFinish={(values) => {
              console.log(values, "xx");
              if (Object.keys(initialDetails).length) {
                update(values);
              } else {
                CreateHandler(false);
              }
            }}
            initialValues={initialDetails}
          >
            <center>
              {error && <span style={{ color: "red" }}>{error}</span>}
            </center>

            <div className="form">
              <div className="title-and-input">
                <label>Full Name*</label>
                <Form.Item
                  name="fullname"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Full Name!",
                    },
                  ]}
                >
                  <Input
                    style={{ width: "782px", height: "32px" }}
                    suffix={
                      <Tooltip title="Please provide Full Name">
                        <InfoCircleOutlined
                          style={{ color: "rgba(0,0,0,.45)" }}
                        />
                      </Tooltip>
                    }
                    value={fullname}
                    onChange={(e) => setfullname(e.target.value)}
                  />
                </Form.Item>
              </div>

              <div className="double">
                <div className="title-and-input">
                  <label>Name with initials*</label>
                  <Form.Item
                    name="namewithini"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Name with initials!",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "379px", height: "32px" }}
                      suffix={
                        <Tooltip title="Please provide Name with initials">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                      value={namewithini}
                      onChange={(e) => setNamewithini(e.target.value)}
                    />
                  </Form.Item>
                </div>

                <div className="title-and-input">
                  <label>Display Name*</label>
                  <Form.Item
                    name="displayname"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Display Name!",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "379px", height: "32px" }}
                      suffix={
                        <Tooltip title="Please provide Display Name">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                      value={displayname}
                      onChange={(e) => setdisplayname(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="double">
                <div className="title-and-input">
                  <label>Gender*</label>
                  <Input.Group compact>
                  <Form.Item
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: "Please input your gender!",
                      },
                    ]}
                  >
                    <Select
                      onSelect={(e) => setGender(e)}
                      defaultValue={initialDetails.gender}
                      name="gender"
                      style={{ width: "379px", height: "32px" }}
                    >
                      {" "}
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                     
                    </Select>
                    </Form.Item>
                  </Input.Group>
                
                </div>
                <div className="title-and-input">
                  <label>Date Of Birth*</label>
                  <Form.Item
                    name="dateofbirth"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Date Of Birth!",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "379px", height: "32px" }}
                      type="Date"
                      suffix={
                        <Tooltip title="Please provide Date Of Birth ">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                      value={dateofbirth}
                      onChange={(e) => setDateofbirth(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="double">
                <div className="title-and-input">
                  <label>Email*</label>
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Email!",
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      style={{ width: "379px", height: "32px" }}
                      suffix={
                        <Tooltip title="Please provide Email">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div className="title-and-input">
                  <label>Mobile*</label>
                  <Form.Item
                    name="mobile"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Mobile!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      style={{ width: "379px", height: "32px" }}
                      suffix={
                        <Tooltip title="Please provide Mobile">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="double">
                <div className="title-and-input">
                  <label>Designation*</label>
                  <Form.Item
                    name="Designation"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Designation!",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "379px", height: "32px" }}
                      suffix={
                        <Tooltip title="Please provide Designation">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                      value={Designation}
                      onChange={(e) => setDesignation(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div className="title-and-input">
                  <label>EmployeeType*</label>
                  
                  <Input.Group compact>
                  <Form.Item
                    name="EmployeeType"
                    rules={[
                      {
                        required: true,
                        message: "Please input your EmployeeType!",
                      },
                    ]}
                  >
                    <Select
                      onSelect={(e) => setEmployeeType(e)}
                      defaultValue={initialDetails.EmployeeType}
                      name="EmployeeType"
                      style={{ width: "379px", height: "32px" }}
                    >
                      {" "}
                      <Option value="Full time">Full time</Option>
                      <Option value="Part time">Part time</Option>
                      <Option value="Contract Basis">Contract Basis</Option>
                      <Option value="Other">Other</Option>
                    </Select></Form.Item>
                    
                  </Input.Group>
                
                </div>
              </div>

              <div className="double">
                <div className="title-and-input">
                  <label>Joined Date*</label>
                  <Form.Item
                    name="joineddate"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Joined Date!",
                      },
                    ]}
                  >
                    <Input
                      type="Date"
                      style={{ width: "379px", height: "32px" }}
                      suffix={
                        <Tooltip title="Please provide Joined Date">
                          <InfoCircleOutlined
                            style={{ color: "rgba(0,0,0,.45)" }}
                          />
                        </Tooltip>
                      }
                      value={joineddate}
                      onChange={(e) => setJoineddate(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div className="title-and-input">
                  <label>Experience*</label>
                  
                  <Input.Group compact>
                  <Form.Item
                    name="Experience"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Experience!",
                      },
                    ]}
                  >
                    <Select
                      onSelect={(e) => setExperience(e)}
                      defaultValue={initialDetails.Experience}
                      name="Experience"
                      style={{ width: "379px", height: "32px" }}
                    >
                      {" "}
                      <Option value="01 Years">01 Years</Option>
                      <Option value="02 Years">02 Years</Option>
                      <Option value="03 Years">03 Years</Option>
                      <Option value="04 Years">04 Years</Option>
                      <Option value="05 Years">05 Years</Option>
                      <Option value="06 Years">06 Years</Option>
                      <Option value="07 Years">07 Years</Option>
                      <Option value="08 Years">08 Years</Option>
                     
                    </Select>
                    </Form.Item>
                  </Input.Group>
               
                 
                </div>
              </div>

              <div className="title-and-input">
                <label>Salary*</label>
                <Form.Item
                  name="salary"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Salary!",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    style={{ width: "379px", height: "32px" }}
                    suffix={
                      <Tooltip title="Please provide Salary">
                        <InfoCircleOutlined
                          style={{ color: "rgba(0,0,0,.45)" }}
                        />
                      </Tooltip>
                    }
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                </Form.Item>
              </div>

              <div className="title-and-input">
                <label>Personal Notes*</label>
                <Form.Item
                  name="personalnotes"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Personal Notes!",
                    },
                  ]}
                >
                  <Input
                    style={{ width: "782px", height: "120px" }}
                    suffix={
                      <Tooltip title="Please provide Personal Notes">
                        <InfoCircleOutlined
                          style={{ color: "rgba(0,0,0,.45)" }}
                        />
                      </Tooltip>
                    }
                    value={personalnotes}
                    onChange={(e) => setPersonalnotes(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>

            <Form.Item {...tailLayout}>
              {loading ? (
                <>
                  <Spin /> Submitting in Progess...
                </>
              ) : (
                ""
              )}
            </Form.Item>
          </Form>
        </Modal>
      </>

      <div className="table">
        {" "}
        {
          <Table
            dataSource={data.slice((currentPage - 1) * 5, currentPage * 5)}
            pagination={{
              pageSize: 5,
              total: data.length,
              current: currentPage,
              onChange: handlePageChange,
            }}
            columns={columns}
            onChange={onChange}
          />
        }
      </div>
    </>
  );
};

export default Home;
