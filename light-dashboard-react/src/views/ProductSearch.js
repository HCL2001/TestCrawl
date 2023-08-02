import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Form, Table, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { API_BASE_URL } from "../components/api/api.jsx";
import "react-toastify/dist/ReactToastify.css";

function ProductSearch() {
  const authToken = JSON.parse(JSON.stringify(localStorage.getItem("token")));
  const [form, setForm] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    if (form.search) {
      try {
        const response = await axios.get(
          API_BASE_URL + "/taobao/" + form.search,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setData(response.data);
        console.log("Yêu cầu đã được gửi thành công!");
      } catch (error) {
        if (error.message === "Request failed with status code 403") {
          window.location.reload();
        } else {
          toast.error(error.code, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: true,
          });
        }
      }
    } else {
      toast.error("Bạn vui lòng nhập từ khóa vào ô search!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
    setLoading(false);
  };

  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    setOpen(false);
    try {
      const response = await axios.post(
        API_BASE_URL + "/link",
        {
          s_links: selectedRows,
          id_brand: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.size !== 0) {
        toast.success(
          "Bạn đã lưu " + response.data.size + " link thành công!",
          {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
            hideProgressBar: true,
          }
        );
      } else {
        toast.error("Link đã tồn tại!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      if (error.message === "Request failed with status code 403") {
        window.location.reload();
      } else {
        toast.error(error.code, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };

  const handleModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="m-3">
        <ToastContainer />
        {/* Header Component */}
        <div>
          <h1>TAOBAO</h1>
          <h3>Search of Product</h3>
        </div>
        <div className="mt-4">
          <Form>
            <Row className="align-items-center">
              <Col xs={12} sm={8} md={6} lg={4}>
                <Form.Control
                  type="text"
                  name="search"
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search"
                />
              </Col>
              <Col xs={12} sm={4} md={3} lg={2}>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={handleSubmit}
                  style={{ color: loading ? "#000" : "blue" }}
                >
                  {loading ? "Loading..." : "Search"}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        {/* Table Component */}
        <div className="mt-4">
          <Table
            striped
            bordered
            hover
            id="searchTable"
            style={{ tableLayout: "fixed" }}
          >
            <colgroup>
              <col style={{ width: "5%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Shop Name</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.price}</td>
                  <td>{row.shopName}</td>
                  <td>
                    <a
                      href={row.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {row.link}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {/* Modal Component */}
        <Modal show={open} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận Lưu vào Danh sách</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn lưu những sản phẩm đã chọn vào danh sách
            không?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default ProductSearch;
