
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
          <label htmlFor="image">Course Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*" 
            required
          />
        </div>

        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}


