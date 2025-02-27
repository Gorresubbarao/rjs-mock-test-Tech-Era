import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import Failure from '../Failure'

import CourseItem from '../CourseItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Home extends Component {
  state = {apiStatus: apiStatusConstants.initial, courseStack: []}

  componentDidMount() {
    this.getCourseStack()
  }

  getCourseStack = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const coursesUrl = ` https://apis.ccbp.in/te/courses`
    const response = await fetch(coursesUrl)
    if (response.ok === true) {
      const courseData = await response.json()
      const formattedCoursesData = courseData.courses.map(eachCourse => ({
        id: eachCourse.id,
        logoUrl: eachCourse.logo_url,
        name: eachCourse.name,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        courseStack: formattedCoursesData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={40} width={40} color="#1e293b" />
    </div>
  )

  renderCourses = () => {
    const {courseStack} = this.state

    return (
      <>
        <div className="home-container">
          <div className="responsive-container">
            <h1 className="heading">Courses</h1>
            <ul className="courses-container">
              {courseStack.map(eachCourse => (
                <CourseItem key={eachCourse.id} courseDetails={eachCourse} />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  onRetryFetch = () => {
    this.setState({apiStatus: apiStatusConstants.initial}, this.getCourseStack)
  }

  renderFailureView = () => <Failure onRetry={this.onRetryFetch} />

  renderApiResults = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderCourses()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        <Header />
        {this.renderApiResults()}
      </div>
    )
  }
}

export default Home
