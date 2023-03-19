import { Component, OnInit } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReportService } from '../../shared/services/report.service';

import { DateTime, Interval } from 'luxon';
import { AxiosResponse } from 'axios';
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  serviceChartInstance!: ECharts;
  personChartInstance!: ECharts;
  servicesChartOption: EChartsOption = {};

  personPiChartOption: EChartsOption = {};

  dates: any = [];

  personTotal = 0;
  chronicTotal = 0;
  opdTotal = 0;
  ipdTotal = 0;

  listOfData: any[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];


  constructor (
    private message: NzMessageService,
    private reportService: ReportService,
  ) { }

  ngOnInit() {
    // this.getTotal();
  }

  onServiceChartInit(echart: any) {
    this.serviceChartInstance = echart;
    // this.getLastServices();
  }

  onPersonChartInit(echart: any) {
    this.personChartInstance = echart;
    // this.getPerson();
  }

  private async getLastServices() {
    const _start = DateTime.now().minus({ days: 10 });
    const _end = DateTime.now();
    const start = _start.toFormat('yyyyMMdd');
    const end = _end.toFormat('yyyyMMdd');

    const interval = Interval.fromDateTimes(_start, _end).splitBy({ day: 1 }).map(d => d.start);

    let data = [];
    for await (const d of interval) {
      const _d = d.toFormat('yyyy-MM-dd');
      data.push(_d);
    }

    this.dates = data;

    const messageId = this.message.loading('Loading..').messageId;

    try {
      const response: AxiosResponse = await this.reportService.getLastServices(start, end);
      const data: any = {};
      data.ipd = response.data.ipd || [];
      data.opd = response.data.opd || [];
      this.message.remove(messageId);
      // set Barchart
      this.setServiceChart(data);
    } catch (error) {
      this.message.remove(messageId);
      this.message.error('เกิดข้อผิดพลาด [LAST SERVICES]')
      console.log(error);
    }
  }

  private async getPerson() {
    try {
      const response: AxiosResponse = await this.reportService.getPersonByTypearea();
      const data = response.data;
      // set Barchart
      this.setPieChart(data);
    } catch (error) {
      this.message.error('เกิดข้อผิดพลาด [LAST SERVICES]')
      console.log(error);
    }
  }

  private async getTotal() {
    const messageId = this.message.loading('Loading..').messageId;
    try {
      const response: AxiosResponse = await this.reportService.getTotal();
      this.message.remove(messageId);
      const data = response.data;
      this.personTotal = Number(data.person.total);
      this.chronicTotal = Number(data.chronic.total);
      this.ipdTotal = Number(data.ipd.total);
      this.opdTotal = Number(data.opd.total);
    } catch (error) {
      this.message.remove(messageId);
      this.message.error('เกิดข้อผิดพลาด [TOTAL]')
      console.log(error);
    }
  }

  private async setPieChart(data: any) {
    let results: any = data.results || [];
    let chartData: any = [];

    for await (const d of results) {
      const obj: any = {};
      obj.name = `Typearea ${d.typearea}`;
      obj.value = `${Number(d.total)}`;
      chartData.push(obj);
    }

    this.personChartInstance.setOption({
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      title: {
        text: 'จำนวนประชากรแยกตาม Typearea',
        subtext: 'ณ วันที่ 11 มี.ค. 2566 เวลา 18:00 น.',
        left: 'center',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      series: [
        {
          name: 'จำนวนประชากร',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 30,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: chartData
        },
      ],
    })
  }

  private async setServiceChart(data: any) {
    const series: any = [];
    const objOpd: any = {};
    objOpd.name = 'ผู้ป่วยนอก';
    objOpd.type = 'bar';
    objOpd.data = [];

    let dataOpd: any[] = data.opd;

    for await (const d of this.dates) {
      const idx = _.findIndex(dataOpd, { date_serv: d });
      if (idx > -1) {
        objOpd.data.push(Number(dataOpd[idx].total));
      } else {
        objOpd.data.push(0);
      }
    }

    const objIpd: any = {};
    objIpd.name = 'ผู้ป่วยใน';
    objIpd.type = 'bar';
    objIpd.data = [];

    let dataIpd: any[] = [];
    dataIpd = data.ipd;

    for await (const d of this.dates) {
      const idx = _.findIndex(dataIpd, { dateadm: d });
      if (idx > -1) {
        objIpd.data.push(Number(dataIpd[idx].total));
      } else {
        objIpd.data.push(0);
      }
    }

    series.push(objOpd);
    series.push(objIpd);

    let labels: any = this.dates.map((d: any) => {
      return DateTime.fromISO(d, { zone: 'Asia/Bangkok', locale: 'th' }).toLocaleString(DateTime.DATE_SHORT);
    });

    this.serviceChartInstance?.setOption({
      title: {
        text: 'สถิติการให้บริการ',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      tooltip: {
        trigger: 'axis',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      legend: {
        orient: 'horizontal',
        top: 'top',
        textStyle: {
          fontFamily: "Kanit"
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        nameTextStyle: {
          fontFamily: "Kanit"
        },
        boundaryGap: true,
        data: labels,
      },
      yAxis: {
        type: 'value'
      },
      series: series,
    });

    // this.servicesChartOption.series = series;

  }
}
