# rules generation docs
# dir structure
* classes: (Contains all the classes used to abstract the rules files)
  * Column.php
  * Rule.php
  * RulesFile.php
  * Table.php
* conception: (Contains examples that were used in developement)
 *  table_example.json
* functions:(Contains main functions)
 * database.php (interactions with the database)
 * main.php (main api endpoint that interects with jQuery's frontend)
* rules: (Contains all the rules)
* sessions: (Contains the sessions variables for a specific database)
* icons.php (returns icons, not used in this version)
* index.php
* main.js (main frontend with jQuery)
* rule_add.php (adding a rule's page)
* rule_clone.php (cloning a rule's page)
* rule_edit.php (editing a rule's page)
#1) how to use
##1.1) Session variables
before creating rules for a specific database, a file named *DB_NAME_session_vars.json* must be present
in the sessions folder

the file should be of this format
```json
  {
    "vars": {
      "role": {
        "type": "enum",
        "values": [
          "admin",
          "seller",
          "user",
          "client"
        ]
      },
      "id": {
        "type": "int"
      },
      "sum": {
        "type": "float"
      },
      "name": {
        "type": "varchar"
      },
      "skills": {
        "type": "set",
        "values": [
          "Kickboxing",
          "Webdesign",
          "Backendev"
        ]
      }
    }
  }
```

session variables can be one of the following types: *enum, int, float, varchar, set*

##1.2) Main dashboard
in the dashboard you can select a database, and you can see a table of rules that already exist

You can also create a new rule by providing a *rule name* and selecting a *table* from the dropdown list
!["Main dashboard"](/images/index.png "Main dashboard")

##1.3) Adding and editing a rule
You can add a rule by intering a rule's name and chosing a table/view from the dropdown in the main dashboard
You can edit a rule by chosing a rule from the table and clicking on edit
When adding a new rule, you can select columns to be added, you add labels, and make columns filterable

###1.3.1) Session variables
You can set authorization parameters for your rules by clicking "Add auth"
Each auth parameters can contain many variables which you can add by clicking "Add new var"
variables in the same auth parameter are combined using the logical *AND*, while authorization parameters are combined with each other using the logical *OR*

##1.4) Cloning a rule
Cloning is like copying a rule and changing some parameters
You have to give the new rule a different rule from the old one

##1.5) Deleting a rule
if you no longer want a rule to exist in your file, all you have to do is to delete it from the rules' table

##1.6) Where do i find the results
Results are saved in the *rules* directory, each database has a file under this directory

#Developer:

Abdelmohaimene Tayeb bey

email: dzsigns31@gmail.com

tel: +213 560 73 76 29
