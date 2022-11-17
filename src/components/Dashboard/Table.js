import React from 'react';
import { useState } from "react";
import { CSVLink } from 'react-csv';
import Papa from 'papaparse';

const Table = ({ employees, handleEdit, handleDelete }) => {
  employees.forEach((employee, i) => {
    employee.id = i + 1;
  });

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: null,
  });

  const headers =[
    {label:'ID' , key: 'id'},
    {label:'First Name' , key: 'firstName'},
    {label:'Last Name' , key: 'lastName'},
    {label:'Email' , key: 'email'},
    {label:'Salary' , key: 'salary'},
    {label:'Date' , key: 'date'},
]

const [parsedData, setParsedData] = useState([]);

//State to store table Column name
const [tableRows, setTableRows] = useState([]);

//State to store the values
const [values, setValues] = useState([]);

const changeHandler = (event) => {
  // Passing file data (event.target.files[0]) to parse using Papa.parse
  Papa.parse(event.target.files[0], {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const rowsArray = [];
      const valuesArray = [];

      // Iterating data to get column name and their values
      results.data.map((d) => {
        rowsArray.push(Object.keys(d));
        valuesArray.push(Object.values(d));
      });

      // Parsed Data Response in array format
      setParsedData(results.data);

      // Filtered Column Names
      setTableRows(rowsArray[0]);

      // Filtered Values
      setValues(valuesArray);
    },
  });
};

  return (
    <div className="contain-table">
      <CSVLink data={employees} headers={headers} filename='Exported_Data'>
      <button className='btn btn-primary mb-2'>Export</button>
      </CSVLink>
      <div>
      {/* File Uploader */}
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
     
    </div>
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Salary</th>
            <th>Date</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          
          {employees.length > 0 ? (
            employees.map((employee, i) => (
              <tr key={employee.id}>
                <td>{i + 1}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.email}</td>
                <td>{formatter.format(employee.salary)}</td>
                <td>{employee.date} </td>
                <td className="text-right">
                  <button
                    onClick={() => handleEdit(employee.id)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No Employees</td>
            </tr>
          )}
          {values.map((value, index) => {
            return (
              <tr key={index}>
                {value.map((val, i) => {
                  return (
                  <td key={i}>{val}</td>                
                  );
                })}
                 <td className="text-right">
                  <button
                    onClick={() => handleEdit(value)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDelete(value)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
