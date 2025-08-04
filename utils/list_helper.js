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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
