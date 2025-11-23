from PIL import Image
import os

source_path = "/Users/anteriovieira/.gemini/antigravity/brain/f32bd3a2-6592-4ee6-ac1c-fa65409da1fc/uploaded_image_1763925968985.png"
output_dir = "/Users/anteriovieira/Code/anteriovieira/quickask/apps/extension/icons"
sizes = [16, 48, 128]

def process_icon():
    if not os.path.exists(source_path):
        print(f"Error: Source file not found at {source_path}")
        return

    try:
        img = Image.open(source_path)
        img = img.convert("RGBA")
        
        # Calculate new square size
        width, height = img.size
        new_size = max(width, height)
        
        # Create a new transparent square image
        new_img = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
        
        # Paste original image in the center
        paste_x = (new_size - width) // 2
        paste_y = (new_size - height) // 2
        new_img.paste(img, (paste_x, paste_y))
        
        # Resize and save
        for size in sizes:
            resized_img = new_img.resize((size, size), Image.Resampling.LANCZOS)
            output_path = os.path.join(output_dir, f"icon{size}.png")
            resized_img.save(output_path, "PNG")
            print(f"Saved {output_path}")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    process_icon()
