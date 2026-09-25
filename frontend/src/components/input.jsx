"use client";
import React from "react";

function Input({ title, onChange, value, type, validate }) {
  return (
    <div className="space-y-8 w-full">
      <label htmlFor={title}>{title}</label>
      <br></br>
      <input
        onBlur={(e) => validate(e.target.name, e.target.value)}
        className="mt-2 border  border-gray-700 w-full focus:outline-none focus:border-blue-300 focus:border-2  mb-2 rounded-xl p-2"
        name={title}
        type={type}
        onChange={onChange}
        value={value}
      />
    </div>
  );
}

export default Input;
