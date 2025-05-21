const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// user schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String
  },
  profile: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    displayName: {
      type: String
    },
    bio: {
      type: String
    },
    avatar: {
      type: String
    },
    birthdate: {
      type: Date
    },
    location: {
      country: {
        type: String
      },
      city: {
        type: String
      },
      address: {
        type: String
      }
    },
    socialLinks: {
      facebook: {
        type: String
      },
      twitter: {
        type: String
      },
      instagram: {
        type: String
      },
      linkedin: {
        type: String
      },
      website: {
        type: String
      }
    },
    preferences: {
      theme: {
        type: String,
        default: 'light'
      },
      language: {
        type: String,
        default: 'pl'
      },
      emailNotifications: {
        type: Boolean,
        default: true
      },
      pushNotifications: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      lastSeenVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      }
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema); 