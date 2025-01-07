import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Avatar,
  Typography,
} from "@mui/material";

// Utility function to generate a random color
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ManageableTable = () => {
  const [data, setData] = useState([]); // Full dataset
  const [filteredData, setFilteredData] = useState([]); // Displayed data
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const allColumns = [
    { id: "name", label: "Name", visible: true },
    { id: "managerEmail", label: "Manager Email", visible: true },
    { id: "location", label: "Location", visible: true },
    { id: "department", label: "Department", visible: true },
    { id: "role", label: "Role", visible: true },
    { id: "enps", label: "ENPS", visible: true },
    { id: "mrxScore", label: "MRX Score", visible: true },
    { id: "performanceRating", label: "Performance Rating", visible: true },
    { id: "projectsCompleted", label: "Projects Completed", visible: true },
    { id: "doj", label: "Date of Joining", visible: true },
    { id: "tenure", label: "Tenure (months)", visible: true },
  ];
  const [columns, setColumns] = useState(allColumns);

  // Simulate fetching data
  useEffect(() => {
    const generateMockData = () => {
      return Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        name: `Name ${index + 1}`,
        userEmail: `user${index + 1}@example.com`,
        managerEmail: `manager${index + 1}@example.com`,
        location: `Location ${(index % 5) + 1}`,
        department: `Dept ${(index % 3) + 1}`,
        role: `Role ${(index % 4) + 1}`,
        enps: Math.floor(Math.random() * 100),
        mrxScore: Math.floor(Math.random() * 100),
        performanceRating: Math.floor(Math.random() * 10) + 1,
        projectsCompleted: Math.floor(Math.random() * 20),
        doj: `2023-01-${String(index + 1).padStart(2, "0")}`,
        tenure: Math.floor(Math.random() * 30),
        avatarColor: generateRandomColor(),
      }));
    };

    setData(generateMockData());
  }, []);

  const fetchData = (offset, limit) => {
    return new Promise((resolve) => {
      let result = [...data];

      if (search) {
        result = result.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.managerEmail.toLowerCase().includes(search.toLowerCase())
        );
      }

      setTimeout(() => {
        resolve(result.slice(offset, offset + limit));
      }, 300);
    });
  };

  useEffect(() => {
    const loadPageData = async () => {
      const offset = page * rowsPerPage;
      const limit = rowsPerPage;

      const result = await fetchData(offset, limit);

      if (sortColumn) {
        result.sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];
      
          if (typeof valueA === "number" && typeof valueB === "number") {
            // Numeric comparison
            return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
          } else if (typeof valueA === "string" && typeof valueB === "string") {
            // Lexical comparison (for strings)
            const numericA = parseInt(valueA.match(/\d+/)?.[0], 10) || 0;
            const numericB = parseInt(valueB.match(/\d+/)?.[0], 10) || 0;
      
            if (!isNaN(numericA) && !isNaN(numericB)) {
              return sortDirection === "asc" ? numericA - numericB : numericB - numericA;
            } else {
              if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
              if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
              return 0;
            }
          } else {
            // Fallback for mixed types or other cases
            return 0;
          }
        });
      }
      

      setFilteredData(result);
    };

    loadPageData();
  }, [page, rowsPerPage, sortColumn, sortDirection, search, data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleSort = (columnId) => {
    const newSortDirection =
      sortColumn === columnId && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(columnId);
    setSortDirection(newSortDirection);
  };

  const handleToggleColumn = (columnId) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const visibleColumns = columns.filter((column) => column.visible);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        width: "80%",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          padding:'5px',
          gap:'5px'
        }}
      >
        <TextField
          label="Search by Name or Manager Email"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: "1rem", width: "80%" }}
        />
        <Button onClick={() => setOpenModal(true)} sx={{border:'1px solid gray',width:'20%'}}>Manage Columns</Button>
      </div>
      <TableContainer
        component={Paper}
        style={{ maxWidth: "100%", margin: "1rem 0" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumns.map((column) => (
                <TableCell
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  style={{
                    cursor: "pointer",
                    background: "#f5f5f5",
                    padding: "8px 16px", 
                    fontSize: "0.875rem",
                    fontWeight: 600,

                    ...(column.id === "name"
                      ? {
                          position: "sticky",
                          left: 0,
                          zIndex: 100,
                          backgroundColor: "#fff",
                          borderRight: "2px solid #e0e0e0",
                        }
                      : {}),
                  }}
                >
                  {column.label}{" "}
                  {sortColumn === column.id &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                {visibleColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      ...(column.id === "name"
                        ? {
                            position: "sticky",
                            left: 0,
                            background: "#fff",
                            borderRight: "2px solid #e0e0e0",
                          }
                        : {}),
                    }}
                    sx={{
                      width: "200px", // Adjust the width of each cell
                      maxWidth: "200px", // Optional to limit max width
                      whiteSpace: "nowrap", // Prevent content from wrapping
                      overflow: "hidden", // Hide overflowing content if necessary
                      textOverflow: "ellipsis", // Add ellipsis if the content overflows
                    }}
                  >
                    {column.id === "name" ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar style={{ backgroundColor: row.avatarColor }}>
                          {row.name.charAt(0)}
                        </Avatar>
                        <div style={{ marginLeft: "8px" }}>
                          <Typography>{row.name}</Typography>
                          <Typography variant="body2">
                            {row.userEmail}
                          </Typography>
                        </div>
                      </div>
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          {columns.map((column) => (
            <FormControlLabel
              key={column.id}
              control={
                <Checkbox
                  checked={column.visible}
                  onChange={() => handleToggleColumn(column.id)}
                />
              }
              label={column.label}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageableTable;
