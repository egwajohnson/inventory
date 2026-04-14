import express from "express";
import { Types } from "mongoose";

export interface IAddUser {
  title: string;
  firstName: ["Mr", "Mrs", "Ms", "Dr", "Prof"];
  lastName: string;
  username: string;
  email: string;
  password: string;
  otp: string;
  gender: string;
  DOB: Date;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postcode: number;
  };
  position: UserRole;
  isLoggedIn: boolean;
  refreshToken: string | null;
}

export type UserRole = "Admin" | "Manager" | "Customer" | "Merchant";

export interface ILoginUser {
  email: string;
  password: string;
}
