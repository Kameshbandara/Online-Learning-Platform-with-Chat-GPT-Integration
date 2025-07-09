
export default function CreateCourse() {
  return (
    <div>
      <h1>Create a New Course</h1>
      <form>
        <div>
          <label htmlFor="title">Course Title:</label>
          <input type="text" id="title" name="title" required />
        </div>
        <div>
          <label htmlFor="description">Course Description:</label>
          <textarea id="description" name="description" required></textarea>
        </div>
        <div>
          <label htmlFor="image">Course Image URL:</label>
          <input type="url" id="image" name="image" required />
        </div>
        <button type="submit">Create Course</button>
      </form>
    </div>
  )
}
// This component allows instructors to create a new course by providing a title, description, and image URL.