# Demo Sample Images

This directory contains sample images for demonstrating the DermoScanner AI scan workflow.

## Image Requirements

For the demo, you need **3 sample images** representing different classification types:

1. **benign-sample.jpg** - Example of a benign (low-risk) skin lesion
2. **suspicious-sample.jpg** - Example of a suspicious (moderate-risk) skin lesion  
3. **malignant-sample.jpg** - Example of a malignant (high-risk) skin lesion

## Where to Get Sample Images

### Option 1: Use Existing Test Images
If you already have test images in the project:
```bash
cp dermoscanners/server/test-image.jpg demo/sample-images/benign-sample.jpg
```

### Option 2: Download from Medical Image Databases
Use publicly available dermatology image datasets:

- **DermNet NZ**: https://dermnetnz.org/
  - Free educational resource with thousands of dermatology images
  - Search for "benign nevus", "atypical mole", "melanoma"
  - Download and rename appropriately

- **ISIC Archive**: https://www.isic-archive.com/
  - International Skin Imaging Collaboration
  - Public dataset of skin lesion images
  - Requires free account registration
  - Filter by diagnosis: benign, suspicious, malignant

- **HAM10000 Dataset**: https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/DBW86T
  - Harvard Dataverse
  - 10,000+ dermatoscopic images
  - Labeled with diagnosis

### Option 3: Create Placeholder Images
For testing purposes only (not for production):
```bash
# Create placeholder images with ImageMagick (if installed)
convert -size 800x600 xc:lightpink -pointsize 40 -draw "text 250,300 'Benign Sample'" demo/sample-images/benign-sample.jpg
convert -size 800x600 xc:lightyellow -pointsize 40 -draw "text 200,300 'Suspicious Sample'" demo/sample-images/suspicious-sample.jpg
convert -size 800x600 xc:lightcoral -pointsize 40 -draw "text 220,300 'Malignant Sample'" demo/sample-images/malignant-sample.jpg
```

## Image Specifications

### Technical Requirements
- **Format**: JPEG, PNG, or WebP
- **Size**: Under 5MB (API limit)
- **Resolution**: Minimum 640x480, recommended 1024x768 or higher
- **Aspect Ratio**: Any (app handles responsive display)
- **Color Space**: RGB

### Content Guidelines
- Clear, well-lit images
- Lesion should be centered and in focus
- Include some surrounding skin for context
- Avoid images with identifying information (faces, tattoos, etc.)
- Use images with appropriate licensing for educational/demo purposes

## Demo Usage

### During Live Demo
1. **Benign Sample**: Use first to show positive, low-risk result
   - Expected result: "Benign - Low Risk" with 75-95% confidence
   - Demonstrates green color-coding and reassuring recommendations

2. **Suspicious Sample**: Use second to show moderate-risk result
   - Expected result: "Suspicious - Moderate Risk" with 60-85% confidence
   - Demonstrates yellow color-coding and "consult doctor" recommendations

3. **Malignant Sample**: Use third to show high-risk result (optional)
   - Expected result: "Malignant - High Risk" with 70-90% confidence
   - Demonstrates red color-coding and urgent care recommendations
   - Note: May be too alarming for some audiences, use discretion

### Recommended Demo Flow
For a 7-minute demo, focus on the **benign sample** to keep the tone positive and educational. Only show suspicious/malignant samples if specifically asked about different risk levels.

## Privacy & Ethics

### Important Considerations
- ⚠️ **Never use real patient images without explicit consent**
- ⚠️ **Ensure images are from public datasets or stock photo sources**
- ⚠️ **Do not use images that could identify individuals**
- ⚠️ **Respect copyright and licensing terms**
- ⚠️ **Include disclaimer that these are for demonstration only**

### Disclaimer for Demo
Always include this disclaimer when presenting:
> "The images shown in this demo are from public medical databases and are used for educational purposes only. DermoScanner is a screening tool, not a diagnostic tool, and should not replace professional medical advice."

## File Naming Convention

Use descriptive names that indicate the expected classification:
- `benign-sample.jpg` - Low risk lesion
- `suspicious-sample.jpg` - Moderate risk lesion
- `malignant-sample.jpg` - High risk lesion
- `benign-sample-2.jpg` - Additional benign example (if needed)

## Backup Images

Keep backup copies in case of file corruption:
```bash
cp demo/sample-images/benign-sample.jpg demo/sample-images/benign-sample-backup.jpg
```

## Testing Images Before Demo

Always test images before the live demo:
1. Upload each image to the deployed app
2. Verify the upload succeeds (no format/size errors)
3. Confirm the result displays correctly
4. Check that recommendations load properly
5. Ensure images display well on both desktop and mobile

## Troubleshooting

### Image Won't Upload
- Check file size (must be under 5MB)
- Verify format (JPEG, PNG, or WebP only)
- Try converting to JPEG: `convert image.png image.jpg`
- Compress if needed: Use online tools like TinyJPG

### Image Displays Poorly
- Increase resolution (minimum 640x480)
- Improve lighting and focus
- Center the lesion in the frame
- Crop out unnecessary background

### Mock AI Returns Unexpected Result
- Remember: Mock AI generates random results
- Results are not based on actual image content
- For consistent demo, you may want to modify the mock AI to return specific results for specific images (see `dermoscanners/server/controllers/aiController.js`)

## License Information

Document the source and license for each image:
- `benign-sample.jpg`: [Source] - [License]
- `suspicious-sample.jpg`: [Source] - [License]
- `malignant-sample.jpg`: [Source] - [License]

Common licenses for medical images:
- Creative Commons (CC BY, CC BY-SA)
- Public Domain
- Educational Use Only

---

**Last Updated**: [Date]  
**Maintained By**: DermoScanner Team
