import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Box, Alert, InputLabel, MenuItem, Select, FormControl, Grid, IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DummyPaymentDialog = ({ open, amount, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState('card');
  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  // UPI field
  const [upiId, setUpiId] = useState('');
  // Bank fields
  const [bankName, setBankName] = useState('');
  const [accHolder, setAccHolder] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  // Screenshot upload (UPI only)
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const resetFields = () => {
    setCardNumber(''); setExpiry(''); setCvv('');
    setUpiId('');
    setBankName(''); setAccHolder(''); setAccNumber(''); setIfsc('');
    setFile(null); setFileError('');
  };

  const handlePay = async () => {
    setProcessing(true);
    setError('');
    setFileError('');
    // Validate fields
    if (method === 'card') {
      if (!cardNumber || !expiry || !cvv) {
        setError('Please fill all card details.'); setProcessing(false); return;
      }
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        setError('Card number must be 16 digits.'); setProcessing(false); return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setError('CVV must be 3 or 4 digits.'); setProcessing(false); return;
      }
    } else if (method === 'upi') {
      if (!upiId) {
        setError('Please enter your UPI ID.'); setProcessing(false); return;
      }
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        setError('Invalid UPI ID format.'); setProcessing(false); return;
      }
    } else if (method === 'bank') {
      if (!bankName || !accHolder || !accNumber || !ifsc) {
        setError('Please fill all bank transfer details.'); setProcessing(false); return;
      }
      if (!/^\d{9,18}$/.test(accNumber)) {
        setError('Account Number must be 9-18 digits.'); setProcessing(false); return;
      }
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
        setError('Invalid IFSC code.'); setProcessing(false); return;
      }
    }
    // File validation for UPI only
    if (method === 'upi') {
      if (!file) {
        setFileError('Please upload a screenshot or PDF as payment proof.'); setProcessing(false); return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setFileError('Only .jpg, .png, or .pdf files are allowed.'); setProcessing(false); return;
      }
    }
    // Simulate payment delay
    setTimeout(() => {
      setProcessing(false);
      resetFields();
      onSuccess();
      onClose();
    }, 1200);
  };

  const handleFileChange = (e) => {
    setFileError('');
    const f = e.target.files[0];
    if (f) {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(f.type)) {
        setFileError('Only .jpg, .png, or .pdf files are allowed.');
        setFile(null);
      } else {
        setFile(f);
      }
    }
  };

  const handleClose = () => {
    resetFields();
    setError('');
    setFileError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Complete Payment</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          <b>Total Amount to Pay:</b> <span style={{ color: '#1976d2', fontSize: 20 }}>${amount?.toLocaleString()}</span>
        </Typography>
        <Box mb={2}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={method}
              label="Payment Method"
              onChange={e => setMethod(e.target.value)}
              disabled={processing}
            >
              <MenuItem value="card">Credit/Debit Card</MenuItem>
              <MenuItem value="upi">UPI</MenuItem>
              <MenuItem value="bank">Bank Transfer</MenuItem>
            </Select>
          </FormControl>

          {/* Card Fields */}
          {method === 'card' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Card Number"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value.replace(/[^\d]/g, '').slice(0,16))}
                  fullWidth
                  disabled={processing}
                  inputProps={{ maxLength: 16 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Expiry (MM/YY)"
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  fullWidth
                  disabled={processing}
                  placeholder="MM/YY"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="CVV"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/[^\d]/g, '').slice(0,4))}
                  fullWidth
                  disabled={processing}
                  inputProps={{ maxLength: 4 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          )}

          {/* UPI Fields */}
          {method === 'upi' && (
            <TextField
              label="UPI ID (e.g. phonenumber@upi, yourname@sbi)"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              fullWidth
              disabled={processing}
              sx={{ mb: 2 }}
            />
          )}

          {/* Bank Transfer Fields */}
          {method === 'bank' && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Bank Name"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  fullWidth
                  disabled={processing}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Account Holder Name"
                  value={accHolder}
                  onChange={e => setAccHolder(e.target.value)}
                  fullWidth
                  disabled={processing}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Account Number"
                  value={accNumber}
                  onChange={e => setAccNumber(e.target.value.replace(/[^\d]/g, '').slice(0,18))}
                  fullWidth
                  disabled={processing}
                  sx={{ mb: 2 }}
                  inputProps={{ maxLength: 18 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="IFSC Code"
                  value={ifsc}
                  onChange={e => setIfsc(e.target.value.toUpperCase())}
                  fullWidth
                  disabled={processing}
                  sx={{ mb: 2 }}
                  inputProps={{ maxLength: 11 }}
                />
              </Grid>
            </Grid>
          )}

          {/* Screenshot Upload for UPI only */}
          {method === 'upi' && (
            <Box mt={2} mb={1}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Upload Payment Screenshot / PDF <span style={{ fontSize: 13, color: '#888' }}>(.jpg, .png, .pdf)</span></Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                disabled={processing}
              >
                {file ? file.name : 'Choose File'}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {fileError && <Alert severity="error" sx={{ mt: 1 }}>{fileError}</Alert>}
            </Box>
          )}
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={processing}>Cancel / Close</Button>
        <Button variant="contained" onClick={handlePay} disabled={processing} color="primary">
          {processing ? 'Processing...' : 'Pay Now / Proceed'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DummyPaymentDialog;
