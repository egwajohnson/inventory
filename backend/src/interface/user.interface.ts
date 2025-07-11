import express from 'express';

export interface IAddUser{
  title: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  gender: string;
  DOB: Date;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postcode: number;
  };
  position: string;
}
