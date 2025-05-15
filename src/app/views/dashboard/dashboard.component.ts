import { CommonModule, DOCUMENT, NgFor, NgIf, NgStyle } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Renderer2,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  CardTextDirective,
  CardTitleDirective,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TableModule,
  TextColorDirective,
  TooltipComponent,
  TooltipDirective,
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import Swal from 'sweetalert2';
import { forEach } from 'lodash-es';
import { cilList, cilShieldAlt, cilTrash } from '@coreui/icons';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    CardTitleDirective,
    CardTextDirective,
    ButtonDirective,
    TableModule,
    NgFor,
    NgIf,
    TooltipDirective,
    CommonModule,
    IconDirective,
  ],
})
export class DashboardComponent implements OnInit {
  icons = { cilShieldAlt, cilTrash };

  ngOnInit(): void {
    this.calculateTotalPrice();
    this.grandPrice = this.TotalPrice;
  }
  TotalPrice: any = 0;
  newPrice: boolean = false;

  tooltipText: string = 'Click to remove discount';
  constructor() {}
  cards: boolean = true;
  // products: any = [
  //   { name: 'T-Shirt', price: 350, category: 'Clothing', qty: 1 },
  //   { name: 'Hat', price: 250, category: 'Clothing', qty: 1 },
  //   { name: 'Belt', price: 230, category: 'Clothing', qty: 1 },
  // ];

  // cartProduct: any = {
  //   cart_1: [
  //     { name: 'T-Shirt', price: 350, category: 'Clothing', qty: 1 },
  //     { name: 'Hat', price: 250, category: 'Clothing', qty: 1 },
  //     { name: 'Belt', price: 230, category: 'Clothing', qty: 1 },
  //   ],
  //   cart_2: [
  //     { name: 'T-Shirt', price: 350, category: 'Clothing', qty: 1 },
  //     { name: 'Hat', price: 250, category: 'Clothing', qty: 1 },
  //     { name: 'Belt', price: 230, category: 'Clothing', qty: 1 },
  //   ],
  //   cart_3: [
  //     { name: 'T-Shirt', price: 350, category: 'Clothing', qty: 1 },
  //     { name: 'Hat', price: 250, category: 'Clothing', qty: 1 },
  //     { name: 'Belt', price: 230, category: 'Clothing', qty: 1 },
  //   ],
  //   cart_4: [
  //     { name: 'T-Shirt', price: 350, category: 'Clothing', qty: 1 },
  //     { name: 'Hat', price: 250, category: 'Clothing', qty: 1 },
  //     { name: 'Belt', price: 230, category: 'Clothing', qty: 1 },
  //   ],
  //   cart_5: [
  //     { name: 'T-Shirt', price: 350, category: 'Clothing', qty: 1 },
  //     { name: 'Hat', price: 250, category: 'Clothing', qty: 1 },
  //     { name: 'Belt', price: 230, category: 'Clothing', qty: 1 },
  //   ],
  // };
  // products: any = [
  //   { name: 'T-Shirt', price: 350, category: 'Clothing', qty: 1 },
  //   { name: 'Hat', price: 250, category: 'Clothing', qty: 1 },
  // ];

  products: any = [
    { name: 'T-Shirt', price: 350, category: 'Clothing', qty: 1 },
    { name: 'Hoodie', price: 700, category: 'Clothing', qty: 1 },
    { name: 'Watch', price: 850, category: 'Accessories', qty: 1 },
    { name: 'Bag', price: 640, category: 'Bags', qty: 1 },
  ];
  calculateTotalPrice() {
    var sum = 0;
    for (let index = 0; index < this.products.length; index++) {
      sum += this.products[index].price * this.products[index].qty;
    }

    this.TotalPrice = sum;
    this.discountPrice = sum;
  }
  customerPoint: number = 68; //user point
  coupons: any = [
    {
      id: 1,
      name: 'Fixed amount',
      category: 'Coupon',
      type: 'Fixed',
      desc: 'discount 30 Baht',
      info: 'discount 30 Baht',
    }, // fixed
    {
      id: 2,
      name: 'Percentage discount',
      category: 'Coupon',
      type: 'Percentage',
      desc: 'discount 10%',
      info: 'discount 10% of all amount',
    }, // 10 percentage
  ];
  onTops: any = [
    {
      id: 3,
      name: 'discount for clothing',
      category: 'On Top',
      type: 'Percentage on category',
      desc: '15% For Clothing',
      info: 'discount 15% of all clothing',
    }, // 15 percentage on clothing
    {
      id: 4,
      name: 'Discount by points',
      category: 'On Top',
      type: 'point',
      desc: 'Point',
      info: 'Use Point For Discount ,Maximum Point is 20% of all amount',
    }, // 20 percentage
  ];
  seasonals: any = [
    {
      id: 5,
      name: 'Special campaigns',
      category: 'Seasonal',
      type: 'Percentage',
      desc: 'every ฿300 subtracting ฿40',
      info: 'every 300 THB subtracting 40 THB',
    }, //ever 300 sub 40
  ];

  _coupon: boolean = true;
  _onTop: boolean = true;
  _seasonal: boolean = true;

  getCoupon(item: any) {
    this._coupon = !this._coupon;
    this.cardsItem.push(item);
    // this.sortCampaignsById();
    this.cardsItem.sort((a: any, b: any) => a.id - b.id);
    this.apply();
  }
  getOnTop(item: any) {
    this._onTop = !this._onTop;
    this.cardsItem.push(item);
    // this.sortCampaignsById();
    this.cardsItem.sort((a: any, b: any) => a.id - b.id);
    this.apply();
  }
  getSeasonal(item: any) {
    this._seasonal = !this._seasonal;
    this.cardsItem.push(item);
    // this.sortCampaignsById();
    this.cardsItem.sort((a: any, b: any) => a.id - b.id);
    this.apply();
  }

  cardsItem: any = [];

  removeDiscount(item: any) {
    var id = item.id;
    this.cardsItem = this.cardsItem.filter((item: any) => item.id !== id);
    this._step = this._step.filter((item: any) => item.id !== id);

    if (item.category == 'Coupon') {
      this._coupon = true;
    } else if (item.category == 'On Top') {
      this._onTop = true;
    } else if (item.category == 'Seasonal') {
      this._seasonal = true;
    }
    this.cardsItem.sort((a: any, b: any) => a.id - b.id);
    this._step.sort((a: any, b: any) => a.id - b.id);

    this.apply();
  }

  // sortCampaignsById() {
  //   this.cardsItem.sort((a: any, b: any) => a.id - b.id);
  // }

  discountState: boolean = false;
  discountPrice: number = 0;
  // cal func
  fixedAmount(amount: number) {
    this.discountPrice = Math.max(this.discountPrice - amount, 0);
  }
  percentageDiscount(percentage: number) {
    this.discountPrice = Math.max(
      this.discountPrice * (1 - percentage / 100),
      0
    );
  }

  percentageDiscountByItemCategory(category: string, percentage: number) {
    this.products.forEach((product: any) => {
      if (product.category === category) {
        // ลดราคา 15% สำหรับสินค้าที่อยู่ในประเภท "Clothing"
        this.discountPrice = Math.max(
          this.discountPrice - product.price * (percentage / 100),
          0
        );
      }
    });
  }

  // discountByPoints(cus_point: number) {
  //   var percentage = 20;
  //   var cap = Math.round(this.discountPrice * (percentage / 100));

  //   if (cus_point >= cap) {
  //     cus_point = cus_point - cap;
  //     this.discountPrice = Math.max((this.discountPrice -= cap), 0);
  //   } else {
  //     var _cap = cus_point;
  //     this.discountPrice = Math.max((this.discountPrice - _cap), 0);
  //     this.customerPoint = 0;

  //     console.log("asd",this.discountPrice);

  //   }
  // }

  discountByPoints(cus_point: number) {
    var percentage = 20;
    var cap = Math.round(this.discountPrice * (percentage / 100));

    if (cus_point >= cap) {
      // cus_point = cus_point - cap;
      this.discountPrice = Math.max(this.discountPrice - cap, 0);
    } else {
      var _cap = cus_point;
      this.discountPrice = Math.max(this.discountPrice - _cap, 0);
      // console.log('asd', this.discountPrice);
    }
  }

  specialCampaigns(x: number, y: number) {
    // console.log(this.discountPrice);

    // var res = 0;
    // res = this.applyDiscount(this.discountPrice, res, x, y);
    var res = y * Math.floor(this.discountPrice / x);

    this.discountPrice = Math.max(this.discountPrice - res, 0);
  }

  // applyDiscount(n: number, res: number, x: number, y: number): number {
  //   if (n < x) {
  //     return res;
  //   }
  //   res += y;
  //   n -= x;

  //   return this.applyDiscount(n, res, x, y);
  // }

  submit() {
    if (this.cardsItem.length === 0) {
      Swal.fire({
        title: 'Please Select Coupon',
        text: '',
        icon: 'question',
      });
      return;
    }
    this.discountPrice = this.TotalPrice;
    for (let index = 0; index < this.cardsItem.length; index++) {
      if (this.cardsItem[index].id === 1) {
        this.fixedAmount(30);
      } else if (this.cardsItem[index].id === 2) {
        this.percentageDiscount(10);
      } else if (this.cardsItem[index].id === 3) {
        this.percentageDiscountByItemCategory('Clothing', 15);
      } else if (this.cardsItem[index].id === 4) {
        this.discountByPoints(this.customerPoint);
      } else if (this.cardsItem[index].id === 5) {
        this.specialCampaigns(300, 40);
      }
    }
    this.newPrice = !this.newPrice;
    // this.customerPoint = 0;

    // console.log('discount price : ', this.discountPrice);
  }

  _step: any = [];

  apply() {
    this._step = [];
    var price = this.TotalPrice;
    this.discountPrice = this.TotalPrice;
    var o_price = 0;

    for (let index = 0; index < this.cardsItem.length; index++) {
      if (this.cardsItem[index].id === 1) {
        o_price = price;
        this.fixedAmount(30);

        price = this.discountPrice;

        var obj = {
          name: this.cardsItem[index].name,
          before_step: o_price,
          after_step: price,
          discount_price: o_price - price,
        };

        // console.log(index + 1, obj);
        this._step.push(obj);
      } else if (this.cardsItem[index].id === 2) {
        o_price = price;
        this.percentageDiscount(10);
        price = this.discountPrice;

        var obj = {
          name: this.cardsItem[index].name,
          before_step: o_price,
          after_step: price,
          discount_price: o_price - price,
        };

        // console.log(index + 1, obj);
        this._step.push(obj);
      } else if (this.cardsItem[index].id === 3) {
        o_price = price;
        this.percentageDiscountByItemCategory('Clothing', 15);
        price = this.discountPrice;

        var obj = {
          name: this.cardsItem[index].name,
          before_step: o_price,
          after_step: price,
          discount_price: o_price - price,
        };

        // console.log(index + 1, obj);
        this._step.push(obj);
      } else if (this.cardsItem[index].id === 4) {
        o_price = price;
        this.discountByPoints(this.customerPoint);
        price = this.discountPrice;

        var obj = {
          name: this.cardsItem[index].name,
          before_step: o_price,
          after_step: price,
          discount_price: o_price - price,
        };

        // console.log(index + 1, obj);
        this._step.push(obj);
      } else if (this.cardsItem[index].id === 5) {
        o_price = price;
        this.specialCampaigns(300, 40);
        price = this.discountPrice;

        var obj = {
          name: this.cardsItem[index].name,
          before_step: o_price,
          after_step: price,
          discount_price: o_price - price,
        };

        // console.log(index + 1, obj);
        this._step.push(obj);
      }
    }
    this.SetFinalPrice();
  }
  grandPrice: number = 0;
  SetFinalPrice() {
    if (this._step.length <= 0) {
      this.grandPrice = this.TotalPrice;
      return;
    }

    this.grandPrice = this._step[this._step.length - 1].after_step;
  }
}
