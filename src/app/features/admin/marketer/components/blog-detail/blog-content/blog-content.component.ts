import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import YouTube from '@tiptap/extension-youtube';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import Bold from '@tiptap/extension-bold';


@Component({
  selector: 'app-blog-content',
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.css'],
})
export class BlogContentComponent implements OnInit {

  @Input() content: string | null = null;

  showTextSizeDropdown: boolean = false;




  

  @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  editor!: Editor;

  ngOnInit(): void {
    this.initializeEditor();
  }

  initializeEditor(): void {
    const FontSizeTextStyle = TextStyle.extend({
      addAttributes() {
        return {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize,
            renderHTML: (attributes: { fontSize?: string }) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        };
      },
    });

    const CustomBold = Bold.extend({
      renderHTML({ mark, HTMLAttributes }: { mark: any; HTMLAttributes: Record<string, string> }) {
        const { style, ...rest } = HTMLAttributes;
        const newStyle = `font-weight: bold;${style ? ` ${style}` : ''}`;
        return ['span', { ...rest, style: newStyle.trim() }, 0];
      },
      addOptions() {
        return {
          ...this.parent?.(),
          HTMLAttributes: {},
        };
      },
    });

    this.editor = new Editor({
      element: this.editorContainer.nativeElement,
      extensions: [
        StarterKit,
        CustomBold,
        TextStyle,
        Color,
        FontSizeTextStyle,
        FontFamily,
        Highlight,
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Image,
        YouTube,
      ],
      content: this.content,
        editorProps: {
            attributes: {
                class: 'format lg:format-lg dark:format-invert focus:outline-none format-blue max-w-none',
            },
        }
    });
  }

  toggleBold(): void {
    this.editor.chain().focus().toggleBold().run();
  }

  toggleItalic(): void {
    this.editor.chain().focus().toggleItalic().run();
  }

  toggleUnderline(): void {
    this.editor.chain().focus().toggleUnderline().run();
  }

  toggleStrike(): void {
    this.editor.chain().focus().toggleStrike().run();
  }

  toggleHighlight(): void {
    const isHighlighted = this.editor.isActive('highlight');
    this.editor.chain().focus().toggleHighlight(isHighlighted ?  undefined : { color: '#ffc078'}).run();
  }

  toggleLink(): void {
    const url = window.prompt('Enter link URL:', 'https://flowbite.com');
    if (url) {
      this.editor.chain().focus().toggleLink({ href: url }).run()
      console.log("nam")
    }
    }


  

  toggleHRButton(): void {
    this.editor.chain().focus().setHorizontalRule().run();
  }

  removeLink(): void {
    this.editor.chain().focus().unsetLink().run();
  }

  toggleCode(): void {
    this.editor.chain().focus().toggleCode().run();
  }

  setTextAlign(align: 'left' | 'center' | 'right'): void {
    this.editor.chain().focus().setTextAlign(align).run();
  }

  toggleList(): void {
    this.editor.chain().focus().toggleBulletList().run();
  }

  toggleOrderedList(): void {
    this.editor.chain().focus().toggleOrderedList().run();
  }

  toggleBlockquote(): void {
    this.editor.chain().focus().toggleBlockquote().run();
  }

  setHorizontalRule(): void {
    this.editor.chain().focus().setHorizontalRule().run();
  }

  addImage(): void {
    const url = window.prompt('Enter image URL:', 'https://placehold.co/600x400');
    if (url) this.editor.chain().focus().setImage({ src: url }).run();
  }

  addVideo(): void {
    const url = window.prompt('Enter YouTube URL:', 'https://www.youtube.com/watch?v=KaLxCiilHns');
    if (url)
      this.editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
  }


  displayTextSizeDropdown(): void {
    this.showTextSizeDropdown = !this.showTextSizeDropdown;
  }


  // Method to set font size
  setFontSize(fontSize: string): void {
    this.editor.chain().focus().setMark('textStyle', { fontSize }).run();
  }

  // Method to handle font size dropdown selection
  handleFontSizeSelection(event: Event): void {
    const target = event.target as HTMLElement;
    const fontSize = target.getAttribute('data-text-size');
    if (fontSize) {
      this.setFontSize(fontSize);
      this.showTextSizeDropdown = false;
    }
  }



  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }
}