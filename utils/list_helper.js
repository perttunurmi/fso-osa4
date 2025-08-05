const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce(
    (sum, current) => sum + current.likes
    , 0
  )
}

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (fav, current) => current.likes > fav.likes ? current : fav, blogs[0]
  )
}

const howManyBlogs = (blogs, author) => {
  return blogs.filter(blog => blog.author === author).length
}


// Palauttaa kirjoittajan, jolla on eniten blogeja.
// Päähän sattui, mutta sain toteutettua ilman for-looppia!
const mostBlogs = (blogs) => {

  counts = blogs.map(
    (blog) => {
      author = {
        author: blog.author,
        count: howManyBlogs(blogs, blog.author)
      }
      return author
    }
  )

  most = counts.reduce((most, curr) => curr.count > most.count ? curr : most
    , counts[0])

  return {
    author: most.author,
    blogs: most.count
  }

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
