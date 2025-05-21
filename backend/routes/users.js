const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

// test endpoint
router.get('/', (req, res) => res.send('User Route'));

// rejestracja usera
router.post(
  '/register',
  [
    check('email', 'Proszę podać prawidłowy adres email').isEmail(),
    check('password', 'Hasło musi mieć co najmniej 6 znaków').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Użytkownik już istnieje' }] });
      }

      user = new User({
        email,
        password,
        profile: {
          firstName,
          lastName,
          displayName: firstName ? `${firstName} ${lastName || ''}`.trim() : email
        }
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // TODO: zrobić wysyłanie maila z weryfikacją
      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: config.get('jwtExpiration') },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Błąd serwera');
    }
  }
);

// logowanie + jwt
router.post(
  '/login',
  [
    check('email', 'Proszę podać prawidłowy adres email').isEmail(),
    check('password', 'Hasło jest wymagane').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Nieprawidłowe dane logowania' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Nieprawidłowe dane logowania' }] });
      }

      user.lastActive = Date.now();
      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: config.get('jwtExpiration') },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Błąd serwera');
    }
  }
);

// pobierz profil zalogowanego usera
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Błąd serwera');
  }
});

// update profilu
router.put('/profile', auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'Użytkownik nie znaleziony' });
    }

    const profileData = req.body.profile || req.body;

    const {
      firstName,
      lastName,
      displayName,
      bio,
      birthdate,
      location,
      socialLinks,
      preferences,
      privacy
    } = profileData;

    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (displayName !== undefined) user.profile.displayName = displayName;
    if (bio !== undefined) user.profile.bio = bio;
    if (birthdate !== undefined) user.profile.birthdate = birthdate;

    if (location) {
      user.profile.location = {
        ...user.profile.location,
        ...location
      };
    }

    if (socialLinks) {
      user.profile.socialLinks = {
        ...user.profile.socialLinks,
        ...socialLinks
      };
    }

    if (preferences) {
      user.profile.preferences = {
        ...user.profile.preferences,
        ...preferences
      };
    }

    if (privacy) {
      user.profile.privacy = {
        ...user.profile.privacy,
        ...privacy
      };
    }

    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Błąd serwera');
  }
});

module.exports = router; 