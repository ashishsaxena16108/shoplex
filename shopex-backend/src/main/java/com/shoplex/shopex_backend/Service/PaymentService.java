package com.shoplex.shopex_backend.Service;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.Customer;
import com.razorpay.FundAccount;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
public class PaymentService {
    private final RazorpayClient razorpayClient;
    public PaymentService(@Value("${razorpay.key_id}") String key_id, @Value("${razorpay.key_secret}") String key_secret) throws RazorpayException {
        razorpayClient = new RazorpayClient(key_id, key_secret);
    }
    
    public String getPayment(Integer amount) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_receipt_11");

        Order order = razorpayClient.orders.create(orderRequest);
        String orderId = order.get("id");

        return orderId;
    }
    public String createFundAccount(String contactId, String accountNumber, String ifsc, String name) {
        try {
            JSONObject bankAccount = new JSONObject();
            bankAccount.put("account_number", accountNumber);
            bankAccount.put("ifsc", ifsc);
            bankAccount.put("name", name);

            JSONObject fundAccountRequest = new JSONObject();
            fundAccountRequest.put("contact_id", contactId);
            fundAccountRequest.put("account_type", "bank_account");
            fundAccountRequest.put("bank_account", bankAccount);

            FundAccount fundAccount = razorpayClient.fundAccount.create(fundAccountRequest);
            return fundAccount.toString();

        } catch (RazorpayException e) {
            return "Error creating fund account: " + e.getMessage();
        }
    }

    public void sendPayment(Map<String,Object> data){
       try {
        JSONObject request = new JSONObject();
        request.put("account_number", "your_razorpay_account_number"); // Your RazorpayX Account
        request.put("amount", data.get("amount")); // Amount in paise
        request.put("currency", "INR");
        request.put("mode", "IMPS"); // NEFT, RTGS, IMPS
        request.put("purpose", "vendor_payment");

        // Vendor details
        JSONObject contact = new JSONObject();
        contact.put("name", data.get("vendor_name"));
        contact.put("email", data.get("vendor_email"));
        contact.put("contact", data.get("vendor_phone"));

        // Create a contact first
        Customer createdContact = razorpayClient.customers.create(contact);
        request.put("contact_id", createdContact);

        // Make fund transfer
        FundAccount fundAccount = razorpayClient.fundAccount.create(request);
        
    } catch (Exception e) {
        e.getStackTrace();
    }
    }
}
