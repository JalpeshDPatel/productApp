// src/components/ProductList.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Pagination,
  Alert,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [isFormOpen, setFormOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const productsPerPage = 15;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    updateVisibleProducts();
  }, [products, currentPage]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7031/api/Products/GetAllProducts"
      );
      setProducts(response.data);
    } catch (error) {
      setError("Error while fetching products. Please try again later.");
      notify("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const updateVisibleProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setVisibleProducts(products.slice(startIndex, endIndex));
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleAddProduct = () => {
    setFormOpen(true);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = (product) => {
    setFormOpen(true);
    setSelectedProduct(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
    });
  };

  const handleDeleteProduct = (productId) => {
    setSelectedProduct(productId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // logic for handling delete action
    axios
      .delete(
        `https://localhost:7031/api/Products/DeleteProduct/${selectedProduct}`
      )
      .then((response) => {
        console.log("Product deleted successfully:", response.data);
        fetchProducts();
        notify("deletesuccess");
      })
      .catch((error) => {
        console.error("Error deleting product", error);
      })
      .finally(() => {
        setDeleteDialogOpen(false);
      });
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProduct(null);
    setNewProduct({ name: "", description: "", price: "" });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "price" && !/^\d+(\.\d*)?$/.test(value)) {
      notify("price only numbers");
      return;
    }
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddOrUpdateProductSubmit = () => {
    if (!newProduct.name.trim() || !newProduct.description.trim()) {
      notify("Fill all the fields");
      return;
    }
    if (selectedProduct) {
      // Update existing product
      axios
        .put(
          `https://localhost:7031/api/Products/UpdateProduct/${selectedProduct}`,
          newProduct
        )
        .then((response) => {
          console.log("Product updated successfully:", response.data);
          fetchProducts();
          notify("updatesuccess");
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          if (error.message == "Network Error") {
            notify(error.message);
          }
        });
    } else {
      axios
        .post("https://localhost:7031/api/Products/CreateProduct", newProduct)
        .then((response) => {
          console.log("Product added successfully:", response.data);
          fetchProducts();
          setCurrentPage(Math.ceil(products.length / productsPerPage));
          notify("addsuccess");
        })
        .catch((error) => {
          console.error("Error adding product:", error);
          if (error.message == "Network Error") {
            notify(error.message);
          }
        });
    }
    // Close the form after submission
    setFormOpen(false);
    setSelectedProduct(null);
    setNewProduct({ name: "", description: "", price: "" });
  };

  const notify = (notifyStatus) => {
    console.log(notifyStatus, "notifyStatus");
    if (notifyStatus == "addsuccess") {
      toast.success("Product added successfully!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (notifyStatus == "updatesuccess") {
      toast.success("Product updated successfully!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (notifyStatus == "deletesuccess") {
      toast.success("Product deleted successfully!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (notifyStatus == "Fill all the fields") {
      toast.warn("Fill all the fields", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (notifyStatus == "price only numbers") {
      toast.warn("Price field only takes numbers", {
        position: "bottom-center",
        autoClose: 300,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else if (notifyStatus == "Network Error") {
      toast.error("Network Error", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(error, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <Paper elevation={3} style={{ margin: "20px", padding: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: " 12px" }}
        onClick={handleAddProduct}
      >
        Add New Product
      </Button>
      <Typography variant="h4">Product List</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Update</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleUpdateProduct(product)}
                    >
                      Update
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Pagination
            count={Math.ceil(products.length / productsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            style={{ marginTop: "20px" }}
          />

          {/* Add/Update Product Form Dialog */}
          <Dialog open={isFormOpen} onClose={handleFormClose}>
            <DialogTitle>
              {selectedProduct ? "Update Product" : "Add New Product"}
            </DialogTitle>
            <DialogContent>
              <TextField
                required
                label="Name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                required
                label="Description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                required
                label="Price"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
                onClick={handleAddOrUpdateProductSubmit}
              >
                {selectedProduct ? "Update Product" : "Add Product"}
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFormClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={isDeleteDialogOpen}
            onClose={handleCancelDelete}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography id="delete-dialog-description">
                Are you sure you want to delete this product?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="secondary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <ToastContainer />
        </>
      )}
    </Paper>
  );
};

export default ProductList;
