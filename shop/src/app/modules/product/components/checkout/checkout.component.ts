import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CartService } from 'src/app/core/services/cart.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Product } from 'src/app/modules/product/model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styles: []
})
export class CheckoutComponent implements OnInit {
  gstAmount!: number;
  grandTotal!: number;
  discount: number = 0; // Discount amount
  pointsToUse: number = 0; // Points to use for discount
  adjustedGrandTotal!: number; // Grand total after applying discount
  shippingForm!: FormGroup;
  user: any;
  cart: Product[] | any = [];
  errorMessage: string = '';

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.shippingForm = this.formBuilder.group({
      firstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      // lastName: new FormControl('', [Validators.minLength(3), Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required, Validators.minLength(10)]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      // state: new FormControl('', [Validators.required]),
      country: new FormControl('India', [Validators.required]),
      // postalCode: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // const navigation = this.router.getCurrentNavigation();
    // if (navigation && navigation.extras.state) {
    //   this.cart = navigation.extras.state['cart'];
    //   this.discount = navigation.extras.state['discount'] || 0;
    //   this.pointsToUse = navigation.extras.state['pointsToUse'] || 0;

    //   // Log values to check
    //   console.log("Received in checkout:");
    //   console.log("Cart:", this.cart);
    //   console.log("Discount:", this.discount);
    //   console.log("Points to use:", this.pointsToUse);
    // }
    this.route.queryParams.subscribe(params => {
      this.cart = JSON.parse(params['cart']);
      this.discount = parseInt(params['discount']);
      this.grandTotal = parseInt(params['grandTotal']);
      this.pointsToUse = parseInt(params['pointsToUse']);
    });

    this.getUserDetails();
    this.getTotal();
    console.log("calcul point ",this.user.points)
    console.log("calcul point ",this.pointsToUse)

  }

  // getUserDetails() {
  //   this.user = JSON.parse(localStorage.getItem('userconnect')!);
  //   if (this.user) {
  //     this.shippingForm.patchValue({
  //       firstName: this.user.name || '',
  //       email: this.user.email || '',
  //       mobile: this.user.mobile || ''
  //     });
  //   }
  // }

  getUserDetails() {
    this.user = JSON.parse(localStorage.getItem('userconnect')!) || {}; // Initialize user as an empty object if null
    if (this.user) {
      this.shippingForm.patchValue({
        firstName: this.user.name || '',
        email: this.user.email || '',
        point: this.user.point || ''
      });
    }
  }
  getTotal() {
    this.cartService.gstAmount.subscribe(data => this.gstAmount = parseInt(data.toFixed(2)));
    this.cartService.estimatedTotal.subscribe(data => {
      this.grandTotal = parseInt(data.toFixed(2)); // Update grandTotal
      this.adjustedGrandTotal = this.grandTotal - this.discount; // Calculate adjustedGrandTotal
    });
  }

  get firstName() {
    return this.shippingForm.get('firstName');
  }
  // get lastName() {
  //   return this.shippingForm.get('lastName');
  // }
  get email() {
    return this.shippingForm.get('email');
  }
  get mobile() {
    return this.shippingForm.get('mobile');
  }
  get address() {
    return this.shippingForm.get('address');
  }
  // get state() {
  //   return this.shippingForm.get('state');
  // }
  get city() {
    return this.shippingForm.get('city');
  }
  get country() {
    return this.shippingForm.get('country');
  }
  // get postalCode() {
  //   return this.shippingForm.get('postalCode');
  // }

  onSave() {
    console.log("forms", this.cartService.getCart);
    console.error("this this.discount000", this.discount);

    const cart = this.cartService.getCart;
    console.error("this user", this.user);

    cart.forEach((item: any) => {
      console.log(`Title: ${item.title}, Price: ${item.price}, Quantity: ${item.qty}`);
    });

    const products = cart.map((item: any) => ({
      product: item._id, // Assuming item._id is the identifier for the product
      price: item.price,
      qty: item.qty,
      title: item.title
    }));
    console.log("Transformed products:", products);
    console.log("Transformed cart:", cart);

    if (products.length === 0) {
      console.error("Products array is empty");
      return;
    }
    console.error("this user", this.user);
    console.error("this this.discount", this.discount);

    const pointsToUse = Math.max(this.pointsToUse, 40); // Ensure minimum points to use is 40



    const orderDetails = {
      user: this.user.id, // Ensure this is _id
      mobile: this.shippingForm.value.mobile,
      address: this.shippingForm.value.address,
      city: this.shippingForm.value.city,
      country: this.shippingForm.value.country,
      gstAmount: this.gstAmount,
      // grandTotal: this.grandTotal,
      grandTotal: this.adjustedGrandTotal, // Use adjusted grand total
      discount: this.discount, // Include discount field
      products: products,
      pointsToUse:this.pointsToUse
      // cart: cart
    };

    console.log("forms1222", orderDetails);

    this.authService.addCmd(orderDetails).subscribe(
      response => {
        console.log('Order saved successfully', response);
        alert('Order saved successfully');
        this.shippingForm.reset();
        this.errorMessage = ''; // Clear any previous error message

      // Handle points update
      if (this.pointsToUse > 0) {

        const deductedPoints = Math.min(this.user.points, pointsToUse); // Deduct minimum of user points or pointsToUse
        this.user.points -= deductedPoints;

      }
      if (this.adjustedGrandTotal > 100) {
        this.user.points += 20; // Award additional points if adjusted grand total is greater than $100
      }
      localStorage.setItem('userconnect', JSON.stringify(this.user));
    },
      error => {
        console.error('Error saving order', error);
        this.errorMessage = error.message || 'Error saving order';
        alert(this.errorMessage);
      }
    );
  }

}
