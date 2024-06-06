import { Injectable } from '@angular/core';
import { Product } from 'src/app/modules/product/model';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // private cart: Product[] = [];
  private products = new BehaviorSubject<Product[]>([]);
  // public totalAmount = new BehaviorSubject<number>(0);
  // public gstAmount = new BehaviorSubject<number>(0);
  // public estimatedTotal = new BehaviorSubject<number>(0);
  private cart: Product[] = [];
  private totalAmountSource = new BehaviorSubject<number>(0);
  totalAmount = this.totalAmountSource.asObservable();
  private gstAmountSource = new BehaviorSubject<number>(0);
  gstAmount = this.gstAmountSource.asObservable();
  private estimatedTotalSource = new BehaviorSubject<number>(0);
  estimatedTotal = this.estimatedTotalSource.asObservable();


  constructor(private http: HttpClient) {}

  public get getCart(): Product[] {
    return this.cart;
  }

  public add(product: Product) {
    this.cart.push(product);
    this.updateQtyAndTotalPrice(product);
    this.products.next(this.cart);
  }

  public remove(product: Product) {
    this.cart.map((prod: Product, index: number) => {
      if (product._id === prod._id) {
        this.cart.splice(index, 1);
      }
    });
    this.products.next(this.cart);
  }

  updateQtyAndTotalPrice(item: Product) {
    const index = this.find(item);
    const products = this.getCart;
    let totalQty = (products[index].qty = 1);
    totalQty = totalQty;
    let subTotal = products[index].price * totalQty;
    products[index].totalprice = subTotal;
  }

  find(item: Product): number {
    const products = this.getCart;
    const index = products.findIndex((prod) => {
      return prod._id == item._id;
    });
    return index;
  }

  // getTotal(): number {
  //   const total = this.cart.reduce((r: any, c: any) => (r = r + c.totalprice), 0);
  //   const gstRate = 0.18;
  //   this.totalAmount.next(total);
  //   this.gstAmount.next(gstRate * total);
  //   this.estimatedTotal.next(total + this.gstAmount.value);
  //   return total;
  // }
  getTotal(): number {
    const total = this.cart.reduce((r: any, c: any) => (r = r + c.price), 0); // Adjusted to use 'price'
    const gstRate = 0.18;
    this.totalAmountSource.next(total);
    this.gstAmountSource.next(gstRate * total);
    this.estimatedTotalSource.next(total + this.gstAmountSource.value);
    return total;
  }
  updateTotals() {
    const total = this.getTotal();
    const gst = total * 0.18; // Assuming GST rate is 18%
    this.totalAmountSource.next(total);
    this.gstAmountSource.next(gst);
    this.estimatedTotalSource.next(total + gst);
  }



  addQty(item: Product) {
    const products = this.getCart;
    let index = this.find(item);
    let totalQty = products[index].qty;
    if (totalQty !== 12) {
      totalQty = totalQty && totalQty + 1;
    }
    products[index].qty = totalQty;
    let subTotal = products[index].price * totalQty!;
    products[index].totalprice = subTotal;
  }

  lessQty(item: Product) {
    const products = this.getCart;
    let index = this.find(item);
    let totalQty = products[index].qty;
    if (totalQty !== 1) {
      totalQty = totalQty && totalQty - 1;
    }
    products[index].qty = totalQty;
    let subTotal = products[index].price * totalQty!;
    products[index].totalprice = subTotal;
  }
}
