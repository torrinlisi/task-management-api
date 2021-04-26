This was just quickly thrown together and can use some improvements 

**Get Tasks**
----
  If no filter it will return all tasks

* **URL**
  `/`

* **Method:**
  `GET`
  
*  **URL Params**

   **Optional:**
   `filter=string // overdue, upcoming, urgent, completed`
   
* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `[{
      _id: string,
      name: string,
      description: string,
      due: date,
      isComplete: boolean
    }]`
  
  
**Create Task**
----

* **URL**
  `/`

* **Method:**
  `POST`
  
*  **URL Params**

   **Required:**
   `name=string`
   
   **Optional:**
   `description=string`
   
   **Required:**
   `due=date`
   
   **Required:**
   `isComplete=boolean`
   
* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `Success!`
   
**Complete Task**
----

* **URL**
  `/`

* **Method:**
  `PUT`
  
*  **URL Params**

   **Required:**
   `_id=string`
   
   **Required:**
   `isComplete=Boolean`

* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `Success!`

**Delete Task**
----

* **URL**
  `/`

* **Method:**
  `DELETE`
  
*  **URL Params**

   **Required:**
   `_id=string`
   
* **Success Response:**
  * **Code:** 200 <br />
    **Content:** `Success!`
