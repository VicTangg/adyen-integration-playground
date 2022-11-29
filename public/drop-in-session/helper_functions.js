function applyCardDiscount(detectedCard) {
  var appliedDiscount = 0
  var promotionText = ''

  // Check if Bin discount applied
  if (detectedCard['bin'] == '542713') {
    // apply citi cash back discount 25% off
    appliedDiscount = 25
    promotionText = 'Citi Cash Back detected: 25% OFF discount applied'
  } else {
    // Clear Bin Discount if not applicable
    appliedDiscount = 0
  }

  // Check if Brand Discount applied
  if (detectedCard['brand'] == 'mc') {
    // apply mc 20% off
    if (appliedDiscount <= 20) {
      appliedDiscount = 20
      promotionText = 'Mastercard detected: 20% OFF discount applied'
    }
  } else if (detectedCard['brand'] == 'jcb') {
    if (appliedDiscount <= 30) {
      appliedDiscount = 30
      promotionText = 'JCB detected: 30% OFF discount applied'
    }
  } else if (detectedCard['brand'] == 'amex') {
    if (appliedDiscount <= 30) {
      appliedDiscount = 30
      promotionText = 'AMEX detected: 30% OFF discount applied'
    }
  } else if (detectedCard['brand'] == 'visa') {
    if (appliedDiscount <= 40) {
      appliedDiscount = 40
      promotionText = 'Visa detected: 40% OFF discount applied'
    }
  } else {
    // No brand detected
    appliedDiscount = 0
    promotionText = 'No promotion'
  }

  // Apply Final discount
  return {
    'appliedDiscount': appliedDiscount,
    'promotionText': promotionText
  }
}
