# Insys Knowledge Base

## Basic State of Termed Salesperson for Issuetrak

![image](https://user-images.githubusercontent.com/11879769/45961499-7f53c080-bfd3-11e8-82dd-0c6f09dcf8a7.png)

## Basic State of Termed Local person for IssueTrak

![image](https://user-images.githubusercontent.com/11879769/46113646-17a09f80-c1a4-11e8-92b9-c15de2649297.png)

You need to email Mike Carillo to `Disable Building Badges and codes` before saying `yes` on the task \
n/a if they don't have devices on airwatch \
n/a if they don't have devices on verizon wireless \
n/a if they're not a part of Motus \
Go to Cox website to remove them from phone line
 - Benson Cox login info in technician keepass
 - lookup user name
 
 ## Scripts and Parameters to run
 
```
insys-Term-LOA_v3 
      -changeType <LOA | Term>
      -Identity <user's name>
      -subtype <Full | Keep Mail Active>


new-InsysUser_v3
      -AccType <Corp | Field | GMP | PSC | R&D | Texas>
      -Alias <flastname> 
      -Fname <firstname>
      -Lname <lastname>
      -company <INSYSRX | Temp/Contractor>
      -department <Account Manager | Administration | Business Intelligence | Clinical Development | Compliance | Executive | Finance | Human Resources | Information Technology | Legal | Managed Markets | Manufacturing | Marketing | Medical Affairs | Patient Services Center | QA | QC | Quality Control | R&D | Regulatory | Sales | Training & Development>
      -fdepartment <Account Manager | Sales>
      -title "<Title of new employee>"
      -manager "<full name>"
      
      
$ insys-Term-LOA_v3 -changeType Term -Identity jlangseth -subtype Full 
$ new-InsysUser_v3 -AccType Corp -Alias jdoe -Fname John -Lname Doe -company INSYSRX -department Information Technology -title "IT Support Specialist" -manager jclarke
      
```
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
    

## Sync is broke for Contacts/Mail/Calendars/Notes

```
This is what you'll need to do to fix this.
1) you'll need to remove restrictions
2) you'll need to turn off Contacts and then back on again.

Let's start with removing restrictions.
If you have OS 11 do these instructions
    Click the home button
    Click on "Settings"
    Scroll down a little until you find General
    Click on General
    Scroll down a little until you find "Restrictions  On"
    If it says "Restrictions  Off" you can move to just move onto 2)
    The password is 1333
    Scroll down a little until you find "Accounts"
    Click on "Don't Allow Changes"
    Press the Home button

If you have OS 12 do these instructions
    Click the home button
    Click on "Settings"
    Scroll down a little until you find "Screen Time"
    Click on "Screen Time"
    Scroll down a little until you find "Content & Privacy Restrictions"
    Click "Content & Privacy Restrictions"
    The password is 1333
    Scroll down a little until you find "Account Changes"
    Click on "Account Changes"
    Click on "Allow"
    Press the Home button

Let's start with turning your Contacts on and then off again
    Double click your home button and swipe up on "Settings"
    This will clear out settings so you can start from the beginning
    Scroll down a little until you find "Accounts & Passwords"
    Click on "Accounts & Passwords"
    Click on "Exchange"
    Click on the slider button for "Contacts" it should be in the off position (No green)
    Click on "Delete from My iPhone"
    Click on the slider button again, it should be in the on position (green)
    This will begin downloading all of the events you are interested in.
  ```
