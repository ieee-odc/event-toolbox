import React, { useState } from "react";
import { Table, Card, Button, Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import CustomSideBar from "../../../core/components/Sidebar/CustomSideBar";
import CustomNavBar from "../../../core/components/NavBar/CustomNavBar"; // Assuming you have a custom navbar

const AdminApproval = () => {
    const [statusFilter, setStatusFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [openSideBar, setOpenSideBar] = useState(true);

    const toggleSideBar = () => {
        setOpenSideBar((prev) => !prev);
    };

    const handleApprove = () => {
        // Logic for approving the organizer
    };

    const handleDecline = () => {
        // Logic for declining the organizer
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
    };

    const organizers = [
        { id: 1, name: "Organizer 1", email: "organizer1@example.com", sb: "SB1", status: "Approved", phone: "123-456-7890", date: "2024-08-25" },
        { id: 2, name: "Organizer 2", email: "organizer2@example.com", sb: "SB2", status: "Declined", phone: "098-765-4321", date: "2024-08-24" },
        { id: 3, name: "Organizer 3", email: "organizer3@example.com", sb: "SB3", status: "Approved", phone: "555-123-4567", date: "2024-08-23" },
    ];


    const filteredOrganizers = organizers.filter((org) =>
        (!statusFilter || org.status === statusFilter) &&
        (org.name.toLowerCase().includes(searchTerm.toLowerCase()) || org.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="layout-container">
            <CustomSideBar
                openSideBar={openSideBar}
                toggleSideBar={toggleSideBar}
            />
            <div
                className="layout-page"
                style={{ display: "flex", flexDirection: "column" }}
                onClick={() => {
                    if (openSideBar) {
                        toggleSideBar();
                    }
                }}
            >
                <CustomNavBar toggleSideBar={toggleSideBar} />

                <div className="container-fluid py-4">
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <Card className="text-center" style={{ backgroundColor: "rgba(255, 99, 132, 0.2)" }}>
                                <Card.Body>
                                    <Card.Title>Total Organizers</Card.Title>
                                    <Card.Text>3</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-3">
                            <Card className="text-center" style={{ backgroundColor: "rgba(54, 162, 235, 0.2)" }}>
                                <Card.Body>
                                    <Card.Title>Pending Requests</Card.Title>
                                    <Card.Text>1</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-3">
                            <Card className="text-center" style={{ backgroundColor: "rgba(75, 192, 192, 0.2)" }}>
                                <Card.Body>
                                    <Card.Title>Approved Organizers</Card.Title>
                                    <Card.Text>2</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-md-3">
                            <Card className="text-center" style={{ backgroundColor: "rgba(255, 206, 86, 0.2)" }}>
                                <Card.Body>
                                    <Card.Title>Declined Organizers</Card.Title>
                                    <Card.Text>1</Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                    {/* Approval Section */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Organizer Name</Card.Title>
                                    <Card.Text>Email: organizer@example.com</Card.Text>
                                    <Card.Text>SB Name: SB1</Card.Text>
                                    <Card.Text>Phone Number: 123-456-7890</Card.Text>
                                    <Card.Text>Date of Request: 2024-08-26</Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button variant="success" onClick={handleApprove}>Approve</Button>
                                        <Button variant="danger" onClick={handleDecline}>Decline</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                    {/* Search and Organizers List */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <InputGroup className="w-50">
                                    <Form.Control
                                        placeholder="Search by name or email"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Button variant="outline-secondary">
                                        <i className="bx bx-search" />
                                    </Button>
                                </InputGroup>

                                <DropdownButton
                                    id="dropdown-status-filter"
                                    title={statusFilter || "Filter by Status"}
                                    onSelect={handleStatusFilterChange}
                                >
                                    <Dropdown.Item eventKey="Approved">Approved</Dropdown.Item>
                                    <Dropdown.Item eventKey="Declined">Declined</Dropdown.Item>
                                    <Dropdown.Item eventKey="">All</Dropdown.Item>
                                </DropdownButton>
                            </div>

                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Student Branch</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrganizers.map((org) => (
                                        <tr key={org.id}>
                                            <td>{org.name}</td>
                                            <td>{org.email}</td>
                                            <td>{org.sb}</td>
                                            <td>{org.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminApproval;
