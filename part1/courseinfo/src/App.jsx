import React, { useState } from 'react'

const Display = (props) => <div>{props.counter}</div>

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

const Header = (props) => <h1>{props.course.name}</h1>

const Part = (props) => <p>{props.name} {props.exercises}</p>


const Content = (props) => {
  console.log(props)
  return (
    <>
      { props.course.parts.map((part, index) => <Part key={index} name={part.name} exercises={part.exercises} />) }
    </>
  )
}

const Total = (props) => <p>Number of exercises {props.course.parts.reduce((sum, part) => sum + part.exercises, 0)}</p>



const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App