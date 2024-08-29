import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Card, Button, Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import CustomSideBar from "../../../core/components/Sidebar/CustomSideBar";
import CustomNavBar from "../../../core/components/NavBar/CustomNavBar";
import { fetchOrganizers, approveOrganizer, declineOrganizer } from "../../../core/Features/Admin";
import { UserData } from "../../../utils/UserData";
import "./AdminApproval.css"
const AdminApproval = () => {
    const dispatch = useDispatch();
    const { organizers, loading, error } = useSelector((state) => state.adminApprovalStore);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [openSideBar, setOpenSideBar] = useState(true);
    const userData = UserData();
    console.log(userData);

    useEffect(() => {
        dispatch(fetchOrganizers());
    }, [dispatch]);

    const handleApprove = (id) => {
        dispatch(approveOrganizer(id));
    };

    const handleDecline = (id) => {
        dispatch(declineOrganizer(id));
    };

    const toggleSideBar = () => {
        setOpenSideBar(!openSideBar);
    };

    const filteredOrganizers = organizers.filter((organizer) => {
        return (
            (statusFilter === "" || organizer.status === statusFilter) &&
            (organizer.username.toLowerCase().includes(searchTerm.toLowerCase()) || organizer.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <div className="card mb-6 ">
            <div className="row g-3 mb-4 d-flex align-items-center justify-content-center">
                <div className="col-md-3 align-items-center justify-content-center text-align-center">
                    <h4 className="m-3 mt-6" style={{ textAlign: "center" }}>Total Organizers</h4>
                    <p style={{ textAlign: "center", fontSize: "18px" }}>{organizers.length}</p>
                </div>
            </div>

            {/* Approval Section */}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div className="row mb-3">
                    {filteredOrganizers.map((organizer) => (
                        <div className="col-md-4 m-4" key={organizer.id}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>{organizer.username}</Card.Title>
                                    <Card.Text>Email: {organizer.email}</Card.Text>
                                    <Card.Text>Requested At: {new Date(organizer.createdAt).toLocaleDateString()}</Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button variant="success" onClick={() => handleApprove(organizer.id)}>
                                            Approve
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDecline(organizer.id)}>
                                            Decline
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            {/* Search and Organizers List */}
            <div className="card">
                <div className="card-body" >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <InputGroup className="w-50">
                            <Form.Control
                                placeholder="Search by username or email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="outline-secondary">
                                <i className="bx bx-search" />
                            </Button>
                        </InputGroup>
                        <DropdownButton
                            id="dropdown-status-filter"
                            title="Filter by Status"
                            onSelect={(status) => setStatusFilter(status)}
                        >
                            <Dropdown.Item eventKey="">All</Dropdown.Item>
                            <Dropdown.Item eventKey="Approved">Approved</Dropdown.Item>
                            <Dropdown.Item eventKey="Declined">Declined</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Requested At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrganizers.map((org) => (
                                <tr key={org.id}>
                                    <td>{org.username}</td>
                                    <td>{org.email}</td>
                                    <td>{new Date(org.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdminApproval;
