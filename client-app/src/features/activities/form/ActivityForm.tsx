import React, { ChangeEvent, useState, useEffect } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import {ActivityFormValues } from "../../../app/models/Activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from 'uuid';
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextImput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/Options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";



export default observer (function ActivityForm()  {

  const {activityStore} = useStore(); 
  const {selectedActivity, closeForm, createActivity, updateActivity, loading,
    loadActivity, loadingInitial} = activityStore

  const {id} = useParams()
  const navigate = useNavigate();

  /*const initialState = selectedActivity ?? {
      id : "",
      title : "",
      category : "",
      description : "",
      date : "",
      city : "",
      venue : "",
  }*/

  const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues())

  const validationSchema =  Yup.object({
    title : Yup.string().required("Activity Title is required"),
    description : Yup.string().required('Activity descritpion is required'),
    category : Yup.string().required(),
    date : Yup.string().required(),
    venue : Yup.string().required(),
    city : Yup.string().required(),
  })

  useEffect(() =>{
      if(id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
  },[id, loadActivity])

  function handleFormSubmit(activity : ActivityFormValues){
    // createOrEdit(activity);
    //activity?.id ? updateActivity(activity) :  createActivity(activity);
    if(!activity.id)
    {
       activity.id = uuid();
      createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    }else{
      updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
    }
  }

  /*
  function handleChange(event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
      console.log(event.target);
      const {name, value} = event.target;
      setActivity({...activity, [name] : value});
  }*/

  if(loadingInitial) <LoadingComponent content="Loadig Activity..." />

  return (
    <Segment clearing>
      <Header content="Activity Details" sub color="teal" />
      <Formik 
         validationSchema={validationSchema}
         enableReinitialize 
         initialValues={activity} 
         onSubmit={values => handleFormSubmit(values)}>
          {({handleSubmit, isValid, isSubmitting, dirty}) => (
             <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
              <MyTextInput placeholder="Title" name="title"/>
              <MyTextArea rows={3} placeholder="Description" name="description"/>
              <MySelectInput options={categoryOptions} placeholder="Category" name="category"/>
              <MyDateInput 
                 placeholderText="Date" 
                 name="date"
                 showTimeSelect
                 timeCaption="time"
                 dateFormat="MMMM d, yyyy h:mm aa"
                 />
              <Header content="Location Details" sub color="teal" />
              <MyTextInput placeholder="City" name="city"/>
              <MyTextInput placeholder="Venue" name="venue" />
             <Button disabled={!isValid || isSubmitting || !dirty} loading={isSubmitting} floated="right" positive type="submit" content='Submit' />
             <Button as={Link} to='/activities' floated="right"  type="button" content='Cancel' />
           </Form>
          )}
      </Formik>      
    </Segment>
  );
})
