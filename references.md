# References

Sources used for pricing data, hardware specifications, and model information in this project.

## TPU Pricing & Hardware

- **Google Cloud TPU Pricing**
  https://cloud.google.com/tpu/pricing
  *On-demand and committed-use (CUD) pricing for TPU v5e, v6e (Trillium), and Ironwood (v7) chips; US region rates used in this tool.*

- **Google Cloud TPU Documentation**
  https://cloud.google.com/tpu/docs/
  *TPU chip specifications including HBM capacity per chip and supported topologies.*

- **Google Cloud Ironwood TPU Announcement**
  https://cloud.google.com/blog/products/compute/ironwood-google-sixth-generation-tpu
  *Ironwood (v7) chip specs: 192 GB HBM per chip, availability and supported pod topologies.*

## vLLM

- **vLLM Documentation**
  https://docs.vllm.ai/
  *Reference for `vllm serve` command flags including `--tensor-parallel-size`, `--max-model-len`, `--dtype`, and `--device tpu`.*

- **vLLM TPU Backend**
  https://docs.vllm.ai/en/latest/getting_started/tpu-installation.html
  *Setup and usage instructions for running vLLM on Google Cloud TPUs.*

## Models

- **Gemma model family (Google)**
  https://huggingface.co/google/gemma-2-2b-it
  https://huggingface.co/google/gemma-7b-it
  https://huggingface.co/google/gemma-3-12b-it
  https://huggingface.co/google/gemma-2-27b-it
  https://huggingface.co/google/gemma-4-31B-it
  *Gemma 2B, 7B, 12B, 27B, and 31B instruction-tuned models; weight sizes used for HBM estimates.*

- **Llama model family (Meta)**
  https://huggingface.co/meta-llama/Llama-2-13b-hf
  https://huggingface.co/meta-llama/Llama-3.1-70B-Instruct
  https://huggingface.co/meta-llama/Llama-3.1-405B-Instruct
  *Llama 2 13B, Llama 3.1 70B, and Llama 3.1 405B models; weight sizes used for HBM estimates.*

## Memory Estimation Methodology

Weight sizes are estimated using standard dtype footprints (BF16 = 2 bytes/param, FP8 = 1 byte/param) plus a **25% overhead** for KV cache and activations, consistent with common vLLM deployment guidelines.
