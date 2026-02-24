# FluentGe V2 - Testing Guide

## 🧪 IMMEDIATE TESTING (Guest Mode)

### Prerequisites
1. App is built: `npm run build` ✅
2. Website is running: Visit `/flashcards/`

### Test Flow: Guest User Journey

#### 1. Initial Load
- [ ] App loads without errors
- [ ] Shows beautiful dark theme
- [ ] Header shows "FluentGe 📝"
- [ ] Right side shows "შესვლა" (Login)

#### 2. Continue as Guest
- [ ] Click "შესვლა" (Login) 
- [ ] See auth screen with Georgian text
- [ ] Click "სტუმრად გაგრძელება" (Continue as Guest)
- [ ] Returns to home screen
- [ ] Header now shows "სტუმარი" (Guest)

#### 3. Add First Deck
- [ ] See 3 free decks: Greetings, Numbers, Food
- [ ] Each shows "უფასო" (Free) badge
- [ ] Premium decks show "🔒 პრემიუმი" and are grayed out
- [ ] Click "+ ჩემს დეკებში" (Add to My Decks) on Greetings
- [ ] Deck is added successfully

#### 4. My Decks Section
- [ ] "ჩემი დეკები" (My Decks) section appears at top
- [ ] Greetings deck shows with blue border
- [ ] Shows stats: "ახალი: 30" (New cards count)
- [ ] Shows progress bar (empty initially)

#### 5. Study Session
- [ ] Click on Greetings deck in "My Decks"
- [ ] See 3 mode options: განმეორება / ბარათები / ქვიზი
- [ ] Click "განმეორება" (Review - first option)
- [ ] Loads review session

#### 6. Review Session Flow
- [ ] Shows progress bar at top (1 / X)
- [ ] Card shows English word (e.g., "Hello")
- [ ] Shows pronunciation: /həˈloʊ/
- [ ] Text says "👆 ნახეთ თარგმანი" (Tap to see translation)
- [ ] Tap card to flip
- [ ] Shows Georgian translation: "გამარჯობა"
- [ ] 4 colored buttons appear: თავიდან/რთული/კარგი/მარტივი
- [ ] Colors: Red/Orange/Green/Blue

#### 7. Rating Cards
- [ ] Click "კარგი" (Good - green button)
- [ ] Card progresses automatically
- [ ] Progress bar updates
- [ ] Next card appears
- [ ] Repeat for few cards

#### 8. Session Complete
- [ ] After completing cards, shows success screen
- [ ] Celebration emoji: 🎊
- [ ] Shows statistics: cards studied, accuracy %, XP earned
- [ ] "მთავარ მენიუში დაბრუნება" (Return to Main Menu) button
- [ ] Click to return to home

#### 9. Progress Verification
- [ ] Back at home, Greetings deck shows updated stats
- [ ] "ახალი" (New) count decreased
- [ ] "მიღწეული" (Mastered) count increased
- [ ] Progress bar shows some progress
- [ ] Due cards may show red badge with number

#### 10. Add More Decks
- [ ] Add Numbers deck
- [ ] Add Food deck
- [ ] Try to add premium deck - should show error for guest
- [ ] Verify "My Decks" section shows all 3

## 🎯 EXPECTED RESULTS

### Performance
- [ ] App loads quickly
- [ ] Smooth animations
- [ ] No console errors
- [ ] Responsive on mobile

### UI/UX
- [ ] Beautiful dark theme
- [ ] Clean Georgian text throughout
- [ ] Intuitive navigation
- [ ] Proper loading states

### Functionality
- [ ] Spaced repetition logic working
- [ ] Progress saving in localStorage
- [ ] Due cards calculation accurate
- [ ] Statistics updating correctly

## 🚨 TROUBLESHOOTING

### Common Issues
1. **Cards not saving**: Check browser localStorage
2. **Wrong card counts**: Refresh page to recalculate
3. **UI breaking**: Check console for errors
4. **Slow performance**: Due to large deck JSON files

### Debug Commands
```javascript
// In browser console:
localStorage.getItem('fluentge_guest_decks')
localStorage.getItem('fluentge_guest_progress')
// Clear guest data:
localStorage.clear()
```

## ✅ PASS CRITERIA

**The app passes testing if:**
- Guest mode works end-to-end
- Spaced repetition algorithm functions
- Progress saves and persists
- UI is polished and error-free
- Mobile experience is smooth

**Ready for Firebase integration once package installs!**