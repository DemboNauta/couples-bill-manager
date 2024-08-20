import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemFormComponent } from './item-form/item-form.component';
import { TicketManagerComponent } from './ticket-manager/ticket-manager.component';
import { LastBillsComponent } from './last-bills/last-bills.component';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../interfaces/user';
import { ExpensesService } from '../services/expenses/expenses.service';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import 'chartjs-plugin-datalabels';
import { BillsGraphsComponent } from './bills-graphs/bills-graphs.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ItemFormComponent, TicketManagerComponent, LastBillsComponent, CommonModule, BaseChartDirective, BillsGraphsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  constructor(private authService: AuthService, private expensesService: ExpensesService) { }

  totalExpense: number = 0;
  totalIncomes: number = 0;
  totalDifference: number = 0;
  loggedInUser: User | null = null;

  // Data and options for the chart
  chartType: ChartType = 'bar';
  chartData: ChartData<'bar'> = {
    labels: ['Gastos', 'Ingresos'],
    datasets: [
      {
        label: 'Gastos',
        data: [this.totalExpense, 0],
        backgroundColor: 'rgba(205, 142, 117, 1)',
        borderColor: 'rgba(205, 142, 117, 1)',
        borderWidth: 1
      },
      {
        label: 'Ingresos',
        data: [0, this.totalIncomes],
        backgroundColor: 'rgba(14, 15, 14, 0.82)',
        borderColor: 'rgba(14, 15, 14, 0.95)',
        borderWidth: 1
      }
    ]
  };
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'top',
        formatter: (value) => value.toFixed(2),
        color: '#000',
        font: {
          size: 14
        },
        padding: 4
      }
    },
    scales: {
      x:{
        stacked: true
      },
      y: {
        beginAtZero: true
      }
    }
  };

  ngOnInit(): void {
    this.authService.verifyToken().subscribe((user) => {
      this.loggedInUser = user;
    });
    this.expensesService.gastos.subscribe((gastos) => {
      this.totalExpense = 0;
      for (let gasto of gastos) {
        this.totalExpense += gasto.amount;
      }
      this.expensesService.incomes.subscribe((incomes) => {
        this.totalIncomes = 0;
        for (let income of incomes) {
          this.totalIncomes += income.amount;
        }

        this.totalDifference=this.totalExpense+this.totalIncomes

        // Update chart data
        let tempTotalExpense: number = this.totalExpense
        
        this.chartData.datasets[0].data = [tempTotalExpense*=-1, 0];
        this.chartData.datasets[1].data = [0, this.totalIncomes];
        if (this.chart) {
          this.chart.update();
        }
      });
    });
  }
  
}
