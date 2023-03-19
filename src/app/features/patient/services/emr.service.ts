import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class EmrService {

  private axiosInstance!: AxiosInstance;

  constructor (@Inject('API_URL') private apiUrl: any) {

    this.axiosInstance = axios.create({
      baseURL: `${this.apiUrl}/emr`
    })

    this.axiosInstance.interceptors.request.use(config => {
      const token = sessionStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    });

    this.axiosInstance.interceptors.response.use(response => {
      return response
    }, error => {
      return Promise.reject(error)
    })
  }

  getOpdInfo(hospcode: any, seq: any, zoneKey: any): Promise<AxiosResponse> {
    const url = `/opd/info`
    return this.axiosInstance.post(url, { hospcode, seq, zoneKey })
  }

  getPersonInfo(hospcode: any, hn: any, zoneKey: any): Promise<AxiosResponse> {
    const url = `/person/info`
    return this.axiosInstance.post(url, { hospcode, hn, zoneKey })
  }

  getOpdDiag(hospcode: any, seq: any, zoneKey: any): Promise<AxiosResponse> {
    const url = `/opd/diag`
    return this.axiosInstance.post(url, { hospcode, seq, zoneKey })
  }

  getOpdDrug(hospcode: any, seq: any, zoneKey: any): Promise<AxiosResponse> {
    const url = `/opd/drug`
    return this.axiosInstance.post(url, { hospcode, seq, zoneKey })
  }

  getOpdLab(hospcode: any, seq: any, zoneKey: any): Promise<AxiosResponse> {
    const url = `/opd/lab`
    return this.axiosInstance.post(url, { hospcode, seq, zoneKey })
  }

}
