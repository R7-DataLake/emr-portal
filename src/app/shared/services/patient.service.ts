import { Inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private axiosInstance!: AxiosInstance;

  constructor (@Inject('API_URL') private apiUrl: any) {

    this.axiosInstance = axios.create({
      baseURL: `${this.apiUrl}/metadata`
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

  getPatientList(query: any, limit: number, offset: number): Promise<AxiosResponse> {
    const url = `/patient/list?query=${query}&limit=${limit}&offset=${offset}`
    return this.axiosInstance.get(url)
  }

  getLastOPD(cid: any): Promise<AxiosResponse> {
    const url = `/opd/last`
    return this.axiosInstance.post(url, { cid })
  }

  getLastIPD(cid: any): Promise<AxiosResponse> {
    const url = `/ipd/last`
    return this.axiosInstance.post(url, { cid })
  }

  search(cid: any): Promise<AxiosResponse> {
    const url = `/search`
    return this.axiosInstance.post(url, { cid })
  }

}
