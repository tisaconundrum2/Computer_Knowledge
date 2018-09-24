# Insys Knowledge Base

## Basic State of Salesperson for Issuetrak

![image](https://user-images.githubusercontent.com/11879769/45961499-7f53c080-bfd3-11e8-82dd-0c6f09dcf8a7.png)

## Adding a person 

    Domain Controller			started by script
    AD > General - Office			started by script 
    AD > General - Telephone Number		this is added after user has been named and setup in airwatch and verizon wireless
    AD > Organization - Job Title		started by script
    AD > Organization - Department		started by script
    AD > Organization - Company		started by script
    AD > Member Of				started by script
    Mail Server				started by script

Once the script is done, synchronize the emails through `admin.microsoft.com`
  
    AirWatch				added when we have users 
    Create Welcome Letter			This is in T:\Documentation\Docs\Employees\New Employee Docs\Welcome Letters
    Motus					We can start this once we have the employee ID from HR
