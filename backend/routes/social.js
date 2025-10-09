const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/social/facebook/posts
// @desc    Get Facebook page posts
// @access  Public
router.get('/facebook/posts', async (req, res) => {
  try {
    if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
      return res.status(503).json({
        success: false,
        message: 'Facebook integration not configured'
      });
    }

    const response = await axios.get(
      `https://graph.facebook.com/v18.0/me/posts`,
      {
        params: {
          access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
          fields: 'id,message,created_time,full_picture,permalink_url',
          limit: 10
        }
      }
    );

    res.json({
      success: true,
      posts: response.data.data
    });
  } catch (error) {
    console.error('Facebook posts error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching Facebook posts'
    });
  }
});

// @route   POST /api/social/facebook/post
// @desc    Create a Facebook post
// @access  Private (Admin)
router.post('/facebook/post', protect, authorize('admin'), async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
      return res.status(503).json({
        success: false,
        message: 'Facebook integration not configured'
      });
    }

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/me/feed`,
      {
        message,
        access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
      }
    );

    res.json({
      success: true,
      postId: response.data.id
    });
  } catch (error) {
    console.error('Facebook post error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating Facebook post'
    });
  }
});

// @route   GET /api/social/youtube/videos
// @desc    Get YouTube channel videos
// @access  Public
router.get('/youtube/videos', async (req, res) => {
  try {
    if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
      return res.status(503).json({
        success: false,
        message: 'YouTube integration not configured'
      });
    }

    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          key: process.env.YOUTUBE_API_KEY,
          channelId: process.env.YOUTUBE_CHANNEL_ID,
          part: 'snippet',
          order: 'date',
          maxResults: 10,
          type: 'video'
        }
      }
    );

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    res.json({
      success: true,
      videos
    });
  } catch (error) {
    console.error('YouTube videos error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching YouTube videos'
    });
  }
});

// @route   GET /api/social/stats
// @desc    Get social media stats
// @access  Private (Admin)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = {};

    // Facebook stats
    if (process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
      try {
        const fbResponse = await axios.get(
          `https://graph.facebook.com/v18.0/me`,
          {
            params: {
              access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
              fields: 'followers_count,fan_count'
            }
          }
        );
        stats.facebook = {
          followers: fbResponse.data.followers_count || fbResponse.data.fan_count || 0
        };
      } catch (error) {
        console.error('Facebook stats error:', error.message);
        stats.facebook = { error: 'Unable to fetch stats' };
      }
    }

    // YouTube stats
    if (process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_CHANNEL_ID) {
      try {
        const ytResponse = await axios.get(
          'https://www.googleapis.com/youtube/v3/channels',
          {
            params: {
              key: process.env.YOUTUBE_API_KEY,
              id: process.env.YOUTUBE_CHANNEL_ID,
              part: 'statistics'
            }
          }
        );
        const ytStats = ytResponse.data.items[0]?.statistics;
        stats.youtube = {
          subscribers: ytStats?.subscriberCount || 0,
          views: ytStats?.viewCount || 0,
          videos: ytStats?.videoCount || 0
        };
      } catch (error) {
        console.error('YouTube stats error:', error.message);
        stats.youtube = { error: 'Unable to fetch stats' };
      }
    }

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Social stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching social media stats'
    });
  }
});

module.exports = router;
