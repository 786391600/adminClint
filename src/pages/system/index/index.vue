<template>
  <div class="index">
    {{content}}
    <quill-editor 
      v-model="content" 
      ref="myQuillEditor" 
      :options="editorOption" 
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)">
    </quill-editor>
  </div>
</template>
<script>
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  export default {
    data () {
      return {
        content: `<section class="_135editor" data-tools="135编辑器" data-id="94555" style="border: 0px none;">
    <section style="width: 100%;padding:1em 0px;" data-width="100%">
        <section style="border: 1px dotted #242424;border-radius:10px;box-sizing: border-box;padding: 0px 4px 4px 4px;background: #cef1f5;">
            <section style="border: 1px dotted #242424;border-radius:10px;margin-top: -10px;background: rgb(254,254,254);padding:0.6em;">
                <section style="display: flex;justify-content: space-between;align-items: center;">
                    <section style="width: 1em;height: 1em;border:1px solid #666;border-radius:100%;"></section>
                    <section style="width: 1em;height: 1em;border:1px solid #666;border-radius:100%;"></section>
                </section>
                <section data-autoskip="1" class="135brush" style=" font-size: 14px;text-align: center;letter-spacing: 1.5px;line-height: 1.75em;color: rgb(63,62,63);">
                    <p>
                        结束了过年的喜悦和热闹
                    </p>
                    <p>
                        生活慢慢收敛归于平静
                    </p>
                    <p>
                        学子归巢
                    </p>
                    <p>
                        又到开学季！
                    </p>
                    <p>
                        那么
                    </p>
                    <p>
                        来了解一下，开学装备吧
                    </p>
                </section>
                <section style="display: flex;justify-content: space-between;align-items: center;">
                    <section style="width: 1em;height: 1em;border:1px solid #666;border-radius:100%;"></section>
                    <section style="width: 1em;height: 1em;border:1px solid #666;border-radius:100%;"></section>
                </section>
            </section>
        </section>
    </section>
</section>
<p>
    <br/>
</p>`
      }
    },
    components: {
      quillEditor
    }
  };
</script>
<style lang="scss" scoped>
  
</style>