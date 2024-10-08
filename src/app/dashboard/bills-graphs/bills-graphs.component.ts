import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ExpensesService } from '../../services/expenses/expenses.service';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { User } from '../../interfaces/user';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bills-graphs',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './bills-graphs.component.html',
  styleUrl: './bills-graphs.component.css'
})
export class BillsGraphsComponent {
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
